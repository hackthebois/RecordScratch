import { comments } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const SelectCommentSchema = z.object({
	resourceId: z.string(),
	authorId: z.string(),
});
export type SelectComment = z.infer<typeof SelectCommentSchema>;

export const CreateCommentSchema = createInsertSchema(comments, {
	content: z.string().min(1).max(10000),
});
export type CreateComment = z.infer<typeof CreateCommentSchema>;
