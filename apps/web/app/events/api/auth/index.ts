import {
	invalidateSession,
	setSessionCookie,
	validateSessionToken,
} from "@recordscratch/auth";
import {
	commentNotifications,
	comments,
	followers,
	followNotifications,
	getDB,
	likeNotifications,
	likes,
	listResources,
	lists,
	profile,
	pushTokens,
	ratings,
	sessions,
	users,
} from "@recordscratch/db";
import { eq, inArray, or } from "drizzle-orm";
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

				await db
					.delete(pushTokens)
					.where(eq(pushTokens.token, expoPushToken));
			}

			return { success: true };
		},
	],
	[
		"/auth/delete",
		async (event) => {
			const session = getHeader(event, "Authorization");
			if (!session) return new Response(null, { status: 401 });
			const { user } = await validateSessionToken(session);
			if (!user) return new Response(null, { status: 401 });

			// Delete user ratings and comments
			const db = getDB();
			await Promise.all([
				// Delete comments from user or to user
				db
					.delete(comments)
					.where(
						or(
							eq(comments.authorId, user.id),
							eq(comments.userId, user.id)
						)
					),
				// Delete followers and following
				db
					.delete(followers)
					.where(
						or(
							eq(followers.userId, user.id),
							eq(followers.followingId, user.id)
						)
					),
				// Delete list resources based on list owner
				async () => {
					const listsList = await db.query.lists.findMany({
						where: eq(lists.userId, user.id),
						with: {
							resources: true,
						},
					});
					const listIds = listsList.map(({ id }) => id);
					await db
						.delete(listResources)
						.where(inArray(listResources.listId, listIds));
				},
				// Delete likes from user or to user
				db
					.delete(likes)
					.where(
						or(
							eq(likes.userId, user.id),
							eq(likes.authorId, user.id)
						)
					),
				// Delete notifications from user or to user
				db
					.delete(commentNotifications)
					.where(
						or(
							eq(commentNotifications.userId, user.id),
							eq(commentNotifications.fromId, user.id)
						)
					),
				db
					.delete(followNotifications)
					.where(
						or(
							eq(followNotifications.userId, user.id),
							eq(followNotifications.fromId, user.id)
						)
					),
				db
					.delete(likeNotifications)
					.where(
						or(
							eq(likeNotifications.userId, user.id),
							eq(likeNotifications.fromId, user.id)
						)
					),
				// Delete sessions
				db.delete(sessions).where(eq(sessions.userId, user.id)),
				// Delete push tokens
				db.delete(pushTokens).where(eq(pushTokens.userId, user.id)),
				// Delete profile
				db.delete(profile).where(eq(profile.userId, user.id)),
				// Delete lists
				db.delete(lists).where(eq(lists.userId, user.id)),
				// Delete ratings
				db.delete(ratings).where(eq(ratings.userId, user.id)),
				// Delete user
				db.delete(users).where(eq(users.id, user.id)),
			]);

			return { success: true };
		},
	],
];
