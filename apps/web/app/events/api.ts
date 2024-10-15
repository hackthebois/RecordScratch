import { getLucia } from "@recordscratch/auth";
import { getDB, sessions, users } from "@recordscratch/db";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import {
	H3Event,
	eventHandler,
	getCookie,
	getQuery,
	getRequestURL,
	sendRedirect,
	setCookie,
} from "vinxi/http";
import { z } from "zod";

// eslint-disable-next-line no-unused-vars
const routes = new Map<string, (event: H3Event) => unknown>([
	[
		"/auth/refresh",
		async (event) => {
			const db = getDB();
			const lucia = getLucia();
			const query = getQuery(event);
			const sessionId = query.sessionId as string;

			if (!sessionId) return;
			const googleId =
				(
					await db
						.select({ googleId: users.googleId })
						.from(sessions)
						.innerJoin(users, eq(users.id, sessions.userId))
						.where(eq(sessions.id, sessionId))
				)[0]?.googleId || null;

			if (!googleId) return;

			await lucia.invalidateSession(sessionId);

			const existingUser = await db.query.users.findFirst({
				where: eq(users.googleId, googleId),
			});
			const userId = existingUser!.id;
			const email = existingUser!.email;

			const session = await lucia.createSession(userId, {
				email,
				googleId,
			});

			return { sessionId: session.id };
		},
	],
	[
		"/auth/signout",
		async (event) => {
			const lucia = getLucia();
			const session = getCookie(event, "auth_session");
			if (!session) return;
			const blankCookie = lucia.createBlankSessionCookie();
			setCookie(
				event,
				blankCookie.name,
				blankCookie.value,
				blankCookie.attributes
			);
			await lucia.invalidateSession(session);
		},
	],
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
]);

export default eventHandler(async (event) => {
	const url = getRequestURL(event);

	const route = routes.get(
		url.pathname.replace(/^\/api/, "").replace(/\/$/, "")
	);
	if (route) return route(event);

	return new Response("Not Found", { status: 404 });
});
