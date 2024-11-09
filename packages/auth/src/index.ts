import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { getDB, sessions, users } from "@recordscratch/db";
import type { Session, User } from "@recordscratch/types";
import { eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/crypto";
import { H3Event, deleteCookie, getCookie, getQuery, setCookie } from "vinxi/http";
import { z } from "zod";

export const generateSessionToken = (): string => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

export const createSession = async (token: string, userId: string): Promise<Session> => {
	const db = getDB();
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	await db.insert(sessions).values(session);
	return session;
};

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const db = getDB();
	console.log("VALIDATING TOKEN", token);
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: users, session: sessions })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessions)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(sessions.id, session.id));
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	const db = getDB();
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function generateId(length: number): string {
	return generateRandomString(length, alphabet("a-z", "0-9"));
}

export const setSessionCookie = (event: H3Event, token: string | undefined): void => {
	if (token) {
		setCookie("session", token, {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: "lax",
			path: "/",
		});
	} else {
		deleteCookie(event, "session");
	}
};

export const setOAuthCookies = (event: H3Event, state: string, verifier?: string): void => {
	setCookie(event, "state", state, {
		secure: process.env.NODE_ENV === "production",
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});
	if (verifier) {
		setCookie(event, "codeVerifier", verifier, {
			secure: process.env.NODE_ENV === "production",
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 min
		});
	}
};

export const validateState = (event: H3Event, PKCE: boolean) => {
	const query = getQuery(event);
	const code = z.string().parse(query.code);
	const state = z.string().parse(query.state);
	const storedState = getCookie(event, "state");

	if (!code || !storedState || state !== storedState) {
		throw new Error("Invalid state");
	}

	if (PKCE) {
		const codeVerifier = getCookie(event, "codeVerifier");
		if (!codeVerifier) {
			throw new Error("Invalid code verifier");
		}
		return { code, codeVerifier };
	}

	return { code, codeVerifier: "" };
};

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
