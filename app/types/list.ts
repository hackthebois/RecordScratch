import { listResources, lists } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Profile, ProfileSchema } from "./profile";

export const listSchema = createInsertSchema(lists, {
	name: z.string().max(50).min(1).trim(),
});

export const insertListSchema = listSchema.pick({
	name: true,
	description: true,
	category: true,
});
export type InsertList = z.infer<typeof insertListSchema>;

export const updateListSchema = listSchema.pick({
	id: true,
	name: true,
	description: true,
});
export const updateFormSchema = listSchema.pick({
	name: true,
	description: true,
});
export type UpdateList = z.infer<typeof updateFormSchema>;

export const selectListSchema = listSchema.pick({
	id: true,
});

export const filterUserListsSchema = listSchema
	.pick({
		userId: true,
	})
	.extend({
		category: listSchema.shape.category.optional(),
	});

export const listResourcesSchema = createInsertSchema(listResources, {
	parentId: z.string().optional(),
});
export type ListItem = z.infer<typeof listResourcesSchema>;

export const getUserSchema = z.object({
	lists: listSchema,
	list_resources: z.array(listResourcesSchema),
	profile: ProfileSchema,
});

export const insertListResourcesSchema = listResourcesSchema.pick({
	parentId: true,
	listId: true,
	resourceId: true,
});

export const selectListResourcesSchema = listResourcesSchema.pick({
	listId: true,
});

export const listOfResourcesSchema = z.object({
	listId: z.string(),
	resources: z.array(listResourcesSchema),
});

export const deleteListResourcesSchema = listResourcesSchema.pick({
	listId: true,
	resourceId: true,
});

export type ListType = z.infer<typeof listSchema>;

export type ListsType = ListType & {
	profile: Profile | null;
	resources: ListItem[];
};
const categorySchema = listSchema.pick({ category: true });
export type Category = z.infer<typeof categorySchema>["category"];

export const GroupedDataSchema = z.object({
	lists: listSchema,
	profile: ProfileSchema.nullable(),
	list_resources: z.array(listResourcesSchema),
});
