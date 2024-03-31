import { getDB, notifications } from "@recordscratch/db";
import { type CreateNotification } from "@recordscratch/types";

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
