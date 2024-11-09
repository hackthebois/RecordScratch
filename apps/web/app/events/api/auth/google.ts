import {
	createSession,
	generateId,
	generateSessionToken,
	setOAuthCookies,
	setSessionCookie,
	validateState,
} from "@recordscratch/auth";
import { getDB, users } from "@recordscratch/db";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { eq } from "drizzle-orm";
import { getQuery, sendRedirect } from "vinxi/http";
import { z } from "zod";
import { Route } from "..";

const getGoogle = (expo: string) => {
	return new Google(
		process.env.GOOGLE_CLIENT_ID!,
		process.env.GOOGLE_CLIENT_SECRET!,
		`${process.env.CF_PAGES_URL}/api/auth/google/callback${expo ? `?expoAddress=${expo}` : ""}`
	);
};

export const googleRoutes: Route[] = [
	[
		"/auth/google",
		async (event) => {
			const query = getQuery(event);
			const google = getGoogle(query.expoAddress as string);

			const state = generateState();
			const codeVerifier = generateCodeVerifier();

			const url: URL = await google.createAuthorizationURL(
				state,
				codeVerifier,
				["profile", "email"]
			);

			setOAuthCookies(event, state, codeVerifier);

			return sendRedirect(event, url.toString());
		},
	],
	[
		"/auth/google/callback",
		async (event) => {
			const db = getDB();
			const query = getQuery(event);
			const { expoAddress } = query;
			const google = getGoogle(expoAddress as string);

			const { code, codeVerifier } = validateState(event, true);

			const tokens = await google.validateAuthorizationCode(
				code,
				codeVerifier
			);

			console.log("TOKENS", tokens);

			const response = await fetch(
				"https://openidconnect.googleapis.com/v1/userinfo",
				{
					headers: {
						Authorization: `Bearer ${tokens.accessToken()}`,
					},
				}
			);

			const user: unknown = await response.json();
			const { sub: googleId, email } = z
				.object({
					sub: z.string(),
					email: z.string(),
				})
				.parse(user);

			let userId: string;
			let redirect: string;
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
				redirect = "/onboard";
			} else {
				userId = existingUser.id;
				redirect = "/";
			}

			const token = generateSessionToken();
			await createSession(token, userId);
			console.log("TOKEN", token);

			if (expoAddress) redirect = `${expoAddress}?session_id=${token}`;
			else setSessionCookie(event, token);

			return sendRedirect(event, redirect);
		},
	],
];
