import {
	commentNotifications,
	comments,
	followNotifications,
	likeNotifications,
	notifications,
	profile,
	ratings,
} from "@recordscratch/db";
import { and, count, desc, eq, getTableColumns } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";
import { alias } from "drizzle-orm/pg-core";

export const notificationsRouter = router({
	get: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		// return await db.query.notifications.findMany({
		// 	where: eq(notifications.userId, userId),
		// 	with: {
		// 		from: true,
		// 		rating: true,
		// 	},
		// 	orderBy: [desc(notifications.createdAt)],
		// });
		const profileAlias = alias(profile, "profileAlias");
		const ratingProfile = alias(profile, "ratingProfile");

		const commentNotifs = await db
			.select({
				notification: { ...getTableColumns(commentNotifications) },
				comment: { ...getTableColumns(comments) },
				profile: { ...getTableColumns(profileAlias) },
				ratingProfile: { ...getTableColumns(ratingProfile) },
			})
			.from(commentNotifications)
			.innerJoin(profileAlias, eq(profileAlias.userId, commentNotifications.fromId))
			.innerJoin(comments, eq(comments.id, commentNotifications.commentId))
			.innerJoin(ratingProfile, eq(comments.authorId, ratingProfile.userId))
			.where(and(eq(commentNotifications.userId, userId)))
			.orderBy(desc(commentNotifications.createdAt));

		const followNotifs = await db
			.select()
			.from(followNotifications)
			.innerJoin(profile, eq(profile.userId, followNotifications.fromId))
			.where(and(eq(followNotifications.userId, userId)))
			.orderBy(desc(followNotifications.createdAt));

		const likeNotifs = await db
			.select()
			.from(likeNotifications)
			.innerJoin(profile, eq(profile.userId, likeNotifications.fromId))
			.innerJoin(
				ratings,
				and(
					eq(ratings.resourceId, likeNotifications.resourceId),
					eq(ratings.userId, likeNotifications.userId)
				)
			)
			.where(and(eq(likeNotifications.userId, userId)))
			.orderBy(desc(likeNotifications.createdAt));

		// Add 'type' attribute to each notification object
		const commentNotificationsWithType = commentNotifs.map((notification) => ({
			...notification,
			notifType: "COMMENT",
			createdAt: notification.notification.createdAt,
		}));

		const followNotificationsWithType = followNotifs.map((notification) => ({
			...notification,
			notifType: "FOLLOW",
			createdAt: notification.follow_notifications.createdAt,
		}));

		const likeNotificationsWithType = likeNotifs.map((notification) => ({
			...notification,
			notifType: "LIKE",
			createdAt: notification.like_notifications.createdAt,
		}));

		// Merge all notification arrays into one
		const allNotifications = [
			...commentNotificationsWithType,
			...followNotificationsWithType,
			...likeNotificationsWithType,
		];

		allNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

		return allNotifications;
	}),
	getUnseen: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		// const unseen = await db
		// 	.select({
		// 		count: count(),
		// 	})
		// 	.from(notifications)
		// 	.where(and(eq(notifications.userId, userId), eq(notifications.seen, false)));
		// return unseen[0].count;

		const unseenComments = await db
			.select({ count: count() })
			.from(commentNotifications)
			.where(
				and(eq(commentNotifications.userId, userId), eq(commentNotifications.seen, false))
			);
		const unseenFollows = await db
			.select({ count: count() })
			.from(followNotifications)
			.where(
				and(eq(followNotifications.userId, userId), eq(followNotifications.seen, false))
			);
		const unseenLikes = await db
			.select({ count: count() })
			.from(likeNotifications)
			.where(and(eq(likeNotifications.userId, userId), eq(likeNotifications.seen, false)));

		return unseenComments[0].count + unseenFollows[0].count + unseenLikes[0].count;
	}),
	markAllSeen: protectedProcedure.mutation(async ({ ctx: { db, userId } }) => {
		// await db
		// 	.update(notifications)
		// 	.set({ seen: true })
		// 	.where(and(eq(notifications.userId, userId), eq(notifications.seen, false)));

		await db
			.update(commentNotifications)
			.set({ seen: true })
			.where(
				and(eq(commentNotifications.userId, userId), eq(commentNotifications.seen, false))
			);
		await db
			.update(followNotifications)
			.set({ seen: true })
			.where(
				and(eq(followNotifications.userId, userId), eq(followNotifications.seen, false))
			);
		await db
			.update(likeNotifications)
			.set({ seen: true })
			.where(and(eq(likeNotifications.userId, userId), eq(likeNotifications.seen, false)));
	}),
});
