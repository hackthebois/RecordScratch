import {
	invalidateSession,
	setSessionCookie,
	validateSessionToken,
} from "@recordscratch/auth";
import { getDB, pushTokens, users } from "@recordscratch/db";
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
					pushTokens: true,
				},
			});

			const expoPushToken = getHeader(event, "Expo-Push-Token");

			// Insert the expo push token
			if (
				expoPushToken &&
				// Only insert the token if the user exists
				existingUser &&
				// Don't insert the same token twice
				!existingUser?.pushTokens.find(
					(token) => token.token === expoPushToken
				)
			) {
				await db
					.insert(pushTokens)
					.values({ token: expoPushToken, userId: user.id });

				return {
					user: {
						...existingUser,
						pushTokens: [...existingUser.pushTokens, expoPushToken],
					},
				};
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

			const expoPushToken = getHeader(event, "Expo-Push-Token");
			// If expo push token, delete it to prevent signed out notifications
			if (expoPushToken) {
				const db = getDB();

				console.log("deleting push token", expoPushToken);
				await db
					.delete(pushTokens)
					.where(eq(pushTokens.token, expoPushToken));
			}

			return { success: true };
		},
	],
];
