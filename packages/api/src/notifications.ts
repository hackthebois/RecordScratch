import "dotenv/config"; // Ensures env vars are loaded first
import {
	commentNotifications,
	followNotifications,
	getDB,
	likeNotifications,
	notifications,
} from "@recordscratch/db";
import {
	type CreateCommentNotification,
	type CreateFollowNotification,
	type CreateLikeNotification,
	type CreateNotification,
} from "@recordscratch/types";

export const createNotification = async (notification: CreateNotification) => {
	const db = getDB();
	// Future: use queue, send push notifications, etc
	await db
		.insert(notifications)
		.values(notification)
		.onConflictDoUpdate({
			target: [
				notifications.userId,
				notifications.resourceId,
				notifications.type,
				notifications.fromId,
			],
			set: {
				updatedAt: new Date(),
			},
		});
};

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
