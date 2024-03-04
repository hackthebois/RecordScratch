import { list_resources, lists } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Profile } from "./profile";

export const listSchema = createInsertSchema(lists, {
	name: z.string().max(50),
});

export const insertListSchema = listSchema.pick({
	name: true,
	description: true,
	category: true,
});
export type InsertList = z.infer<typeof insertListSchema>;

export const selectListSchema = listSchema.pick({
	id: true,
});

export const listResourcesSchema = createInsertSchema(list_resources);

export const insertListResourcesSchema = listResourcesSchema.pick({
	listId: true,
	resourceId: true,
});

export const selectListResourcesSchema = listResourcesSchema.pick({
	listId: true,
});

export type ListType = z.infer<typeof listSchema>;

export type ListsType = { profile: Profile | null; lists: ListType };
