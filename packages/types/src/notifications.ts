import {
	commentNotifications,
	followNotifications,
	likeNotifications,
	notifications,
} from "@recordscratch/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const NotificationSchema = createSelectSchema(notifications);
export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = createInsertSchema(notifications);
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;

/**** Comment Notification Types ****/
export const CreateCommentNotificationSchema = createInsertSchema(commentNotifications);
export type CreateCommentNotification = z.infer<typeof CreateCommentNotificationSchema>;

/**** Follow Notification Types ****/
export const CreateFollowNotificationSchema = createInsertSchema(followNotifications);
export type CreateFollowNotification = z.infer<typeof CreateFollowNotificationSchema>;

/**** Like Notification Types ****/
export const CreateLikeNotificationSchema = createInsertSchema(likeNotifications);
export type CreateLikeNotification = z.infer<typeof CreateLikeNotificationSchema>;
