import {
	invalidateSession,
	setSessionCookie,
	validateSessionToken,
} from "@recordscratch/auth";
import { getDB, users } from "@recordscratch/db";
import { eq } from "drizzle-orm";
import { getCookie, getHeader, getQuery } from "vinxi/http";
import { Route } from "..";

export const authRoutes: Route[] = [
	[
		"/auth/me",
		async (event) => {
			const db = getDB();
			const query = getQuery(event);
			const sessionId =
				getHeader(event, "Authorization") ??
				(query.sessionId as string | undefined);
			if (!sessionId) return { user: null };

			const { user } = await validateSessionToken(sessionId);

			if (!user) {
				return { user: null };
			}

			const existingUser = await db.query.users.findFirst({
				where: eq(users.id, user.id),
				with: {
					profile: true,
				},
			});

			const expoPushToken = getHeader(event, "Expo-Push-Token");
			// Update the expo push token if it's different or not set
			if (
				existingUser &&
				(!existingUser.expoPushToken ||
					expoPushToken !== existingUser.expoPushToken)
			) {
				await db
					.update(users)
					.set({ expoPushToken })
					.where(eq(users.id, user.id));

				return { user: { ...existingUser, expoPushToken } };
			}

			return { user: existingUser };
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
