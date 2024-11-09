import {
	createSession,
	generateSessionToken,
	invalidateSession,
	setSessionCookie,
} from "@recordscratch/auth";
import { getDB, sessions, users } from "@recordscratch/db";
import { eq } from "drizzle-orm";
import { getCookie, getHeader, getQuery } from "vinxi/http";
import { Route } from "..";

export const authRoutes: Route[] = [
	[
		"/auth/refresh",
		async (event) => {
			const db = getDB();
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

			await invalidateSession(sessionId);

			const existingUser = await db.query.users.findFirst({
				where: eq(users.googleId, googleId),
				with: {
					profile: true,
				},
			});

			const userId = existingUser!.id;

			const token = generateSessionToken();
			await createSession(userId, token);

			return { sessionId: token, profile: existingUser!.profile };
		},
	],
	[
		"/auth/signout",
		async (event) => {
			const session =
				getHeader(event, "Authorization") ??
				getCookie(event, "session");
			if (!session) return;
			setSessionCookie(event, undefined);
			await invalidateSession(session);
			return { success: true };
		},
	],
];
