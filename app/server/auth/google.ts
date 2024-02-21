import { env } from "@/env";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import {
	EventHandlerRequest,
	H3Event,
	getCookie,
	getQuery,
	sendRedirect,
	setCookie,
} from "vinxi/http";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { lucia } from "./lucia";

const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${env.VITE_BASE_URL}/auth/google/callback`
);

export const handler = async (event: H3Event<EventHandlerRequest>) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email"],
	});
	setCookie(event, "state", state, {
		secure: process.env.NODE_ENV === "production",
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});
	setCookie(event, "codeVerifier", codeVerifier, {
		secure: process.env.NODE_ENV === "production",
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});
	sendRedirect(event, url.toString());
};

export const callback = async (event: H3Event<EventHandlerRequest>) => {
	// Validation
	const query = getQuery(event);
	const code = z.string().parse(query.code);
	const state = z.string().parse(query.state);
	const storedState = getCookie("state");
	const storedCodeVerifier = getCookie("codeVerifier");

	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		throw new Error("Invalid request");
	}

	const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
	const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`,
		},
	});
	const user: unknown = await response.json();
	const { sub: googleId, email } = z
		.object({
			sub: z.string(),
			email: z.string(),
		})
		.parse(user);

	let userId: string;
	const existingUser = await db.query.users.findFirst({
		where: eq(users.googleId, googleId),
	});

	if (!existingUser) {
		userId = generateId(15);
		await db.insert(users).values({
			id: userId,
			email,
			googleId,
		});
	} else {
		userId = existingUser.id;
	}
	const session = await lucia.createSession(userId, {
		email,
		googleId,
	});
	const sessionCookie = lucia.createSessionCookie(session.id);
	setCookie(event, "session", sessionCookie.serialize(), {
		secure: process.env.NODE_ENV === "production",
		path: "/",
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});
	sendRedirect(event, "/");
};
