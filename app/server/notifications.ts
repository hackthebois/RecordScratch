import { CreateNotification } from "@/types/notifications";
import { db } from "./db";
import { notifications } from "./db/schema";

export const createNotification = async (notification: CreateNotification) => {
	// Future: use queue, send push notifications, etc
	await db
		.insert(notifications)
		.values(notification)
		.onDuplicateKeyUpdate({
			set: {
				updatedAt: new Date(),
			},
		});
};
