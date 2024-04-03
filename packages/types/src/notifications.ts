import { notifications } from "@recordscratch/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const NotificationSchema = createSelectSchema(notifications);
export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = createInsertSchema(notifications);
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
