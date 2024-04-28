import { comments } from "@recordscratch/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { string, z } from "zod";
import type { Profile } from "./profile";

export const SelectCommentSchema = z.object({
	resourceId: z.string(),
	authorId: z.string(),
});
export type SelectComment = z.infer<typeof SelectCommentSchema>;

export const CreateCommentSchema = createInsertSchema(comments, {
	content: z.string().min(1).max(10000),
}).extend({ replyUserId: z.string().optional() });
export type CreateComment = z.infer<typeof CreateCommentSchema>;

export const DeleteCommentSchema = CreateCommentSchema.pick({
	id: true,
	rootId: true,
});

export const SelectReplySchema = CreateCommentSchema.pick({
	authorId: true,
	resourceId: true,
	rootId: true,
});
const CommentSchema = createSelectSchema(comments);
type CommentSchemaType = z.infer<typeof CommentSchema>;

export type CommentAndProfile = CommentSchemaType & { profile: Profile };
export type CommentAndProfileAndParent = CommentSchemaType & { profile: Profile; parent: Profile };
