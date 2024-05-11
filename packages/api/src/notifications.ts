import "dotenv/config"; // Ensures env vars are loaded first
import {
	commentNotifications,
	followNotifications,
	getDB,
	likeNotifications,
} from "@recordscratch/db";
import {
	type CreateCommentNotification,
	type CreateFollowNotification,
	type CreateLikeNotification,
} from "@recordscratch/types";

export const createCommentNotification = async (notification: CreateCommentNotification) => {
	const db = getDB();

	await db.insert(commentNotifications).values(notification);
};

export const createFollowNotification = async (notification: CreateFollowNotification) => {
	const db = getDB();

	await db
		.insert(followNotifications)
		.values(notification)
		.onConflictDoUpdate({
			target: [followNotifications.userId, followNotifications.fromId],
			set: {
				updatedAt: new Date(),
			},
		});
};

export const createLikeNotification = async (notification: CreateLikeNotification) => {
	const db = getDB();

	await db
		.insert(likeNotifications)
		.values(notification)
		.onConflictDoUpdate({
			target: [
				likeNotifications.userId,
				likeNotifications.fromId,
				likeNotifications.resourceId,
			],
			set: {
				updatedAt: new Date(),
			},
		});
};
