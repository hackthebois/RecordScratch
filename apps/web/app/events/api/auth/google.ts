import { getLucia } from "@recordscratch/auth";
import { getDB, users } from "@recordscratch/db";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { getCookie, getQuery, sendRedirect, setCookie } from "vinxi/http";
import { z } from "zod";
import { Route } from "..";

export const googleRoutes: Route[] = [
	[
		"/auth/google",
		async (event) => {
			const query = getQuery(event);
			const expoAddress = query.expoAddress as string;
			const callBackUrl = `${process.env.CF_PAGES_URL}/api/auth/google/callback${
				expoAddress ? `?expoAddress=${expoAddress}` : ""
			}`;
			const google = new Google(
				process.env.GOOGLE_CLIENT_ID!,
				process.env.GOOGLE_CLIENT_SECRET!,
				callBackUrl
			);
			const state = generateState();
			const codeVerifier = generateCodeVerifier();
			const url: URL = await google.createAuthorizationURL(
				state,
				codeVerifier,
				{
					scopes: ["profile", "email"],
				}
			);
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
			return sendRedirect(event, url.toString());
		},
	],
	[
		"/auth/google/callback",
		async (event) => {
			const db = getDB();
			const lucia = getLucia();
			const query = getQuery(event);
			const expoAddress = query.expoAddress as string;
			const callBackUrl = `${process.env.CF_PAGES_URL}/api/auth/google/callback${
				expoAddress ? `?expoAddress=${expoAddress}` : ""
			}`;
			const google = new Google(
				process.env.GOOGLE_CLIENT_ID!,
				process.env.GOOGLE_CLIENT_SECRET!,
				callBackUrl
			);
			const code = z.string().parse(query.code);
			const state = z.string().parse(query.state);
			const storedState = getCookie(event, "state");
			const storedCodeVerifier = getCookie(event, "codeVerifier");

			if (
				!code ||
				!storedState ||
				!storedCodeVerifier ||
				state !== storedState
			) {
				throw new Error("Invalid request Google Request");
			}

			const tokens = await google.validateAuthorizationCode(
				code,
				storedCodeVerifier
			);
			const response = await fetch(
				"https://openidconnect.googleapis.com/v1/userinfo",
				{
					headers: {
						Authorization: `Bearer ${tokens.accessToken}`,
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

			const session = await lucia.createSession(userId, {
				email,
				googleId,
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			setCookie(
				event,
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes
			);

			return sendRedirect(event, redirect);
		},
	],
];
