import { CreateNotification } from "@/types/notifications";
import { db } from "./db";
import { notifications } from "./db/schema";

export const createNotification = async (notification: CreateNotification) => {
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
