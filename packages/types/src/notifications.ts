import { commentNotifications, followNotifications, likeNotifications } from "@recordscratch/db";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**** Comment Notification Types ****/
export const CreateCommentNotificationSchema = createInsertSchema(commentNotifications);
export type CreateCommentNotification = z.infer<typeof CreateCommentNotificationSchema>;

/**** Follow Notification Types ****/
export const CreateFollowNotificationSchema = createInsertSchema(followNotifications);
export type CreateFollowNotification = z.infer<typeof CreateFollowNotificationSchema>;

/**** Like Notification Types ****/
export const CreateLikeNotificationSchema = createInsertSchema(likeNotifications);
export type CreateLikeNotification = z.infer<typeof CreateLikeNotificationSchema>;
