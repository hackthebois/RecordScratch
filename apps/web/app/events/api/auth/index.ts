import { getLucia } from "@recordscratch/auth";
import { getDB, sessions, users } from "@recordscratch/db";
import { eq } from "drizzle-orm";
import { getCookie, getQuery, setCookie } from "vinxi/http";
import { Route } from "..";

export const authRoutes: Route[] = [
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
			return { success: true };
		},
	],
];
