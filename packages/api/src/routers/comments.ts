import { comments } from "@recordscratch/db";
import {
	CreateCommentSchema,
	DeleteCommentSchema,
	SelectCommentSchema,
} from "@recordscratch/types";
import { and, count, desc, eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentsRouter = router({
	getComments: publicProcedure
		.input(SelectCommentSchema)
		.query(async ({ ctx: { db }, input: { resourceId, authorId } }) => {
			const countList = await db
				.select({
					count: count(),
				})
				.from(comments)
				.where(and(eq(comments.resourceId, resourceId), eq(comments.authorId, authorId)));
			return countList[0].count;
		}),
	list: publicProcedure.input(SelectCommentSchema).query(async ({ ctx: { db }, input }) => {
		return await db.query.comments.findMany({
			where: and(
				eq(comments.resourceId, input.resourceId),
				eq(comments.authorId, input.authorId)
			),
			orderBy: desc(comments.createdAt),
			with: {
				profile: true,
			},
		});
	}),
	create: protectedProcedure
		.input(CreateCommentSchema)
		.mutation(async ({ ctx: { db }, input }) => {
			await db.insert(comments).values(input);
		}),

	delete: protectedProcedure
		.input(DeleteCommentSchema)
		.mutation(async ({ ctx: { db, userId }, input: { id } }) => {
			console.log(userId, id);
			const CommentOwnerAndExists = !!(await db.query.comments.findFirst({
				where: and(eq(comments.id, id!), eq(comments.userId, userId)),
			}));

			if (CommentOwnerAndExists) await db.delete(comments).where(eq(comments.id, id!));
			else
				throw new Error(
					`Not Comment Owner Or Comment Doesn't Exist id:${id}, userId:${userId}`
				);
		}),
});
