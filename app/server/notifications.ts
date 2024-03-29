import { CreateNotification } from "@/types/notifications";
import { getDB } from "./db";
import { notifications } from "./db/schema";

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
