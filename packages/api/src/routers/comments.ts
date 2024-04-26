import { comments, profile } from "@recordscratch/db";
import {
	CreateCommentSchema,
	DeleteCommentSchema,
	SelectCommentSchema,
	SelectReplySchema,
} from "@recordscratch/types";
import { and, count, desc, eq, or, getTableColumns, isNull } from "drizzle-orm";
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
		// return await db.query.comments.findMany({
		// 	where: and(
		// 		eq(comments.resourceId, input.resourceId),
		// 		eq(comments.authorId, input.authorId)
		// 	),
		// 	orderBy: desc(comments.createdAt),
		// 	with: {
		// 		profile: true,
		// 	},
		// });

		return await db
			.select({
				...getTableColumns(comments),
				profile: { ...getTableColumns(profile) },
			})
			.from(comments)
			.innerJoin(profile, eq(comments.userId, profile.userId))
			.where(
				and(
					eq(comments.resourceId, input.resourceId),
					eq(comments.authorId, input.authorId),
					isNull(comments.rootId)
				)
			)
			.orderBy(desc(comments.createdAt));
	}),
	create: protectedProcedure
		.input(CreateCommentSchema)
		.mutation(async ({ ctx: { db }, input }) => {
			await db.insert(comments).values(input);
		}),

	delete: protectedProcedure
		.input(DeleteCommentSchema)
		.mutation(async ({ ctx: { db, userId }, input: { id, rootId } }) => {
			console.log(userId, id);
			const CommentOwnerAndExists = !!(await db.query.comments.findFirst({
				where: and(eq(comments.id, id!), eq(comments.userId, userId)),
			}));

			if (CommentOwnerAndExists)
				if (!rootId)
					await db
						.delete(comments)
						.where(or(eq(comments.id, id!), eq(comments.rootId, id!)));
				else await db.delete(comments).where(eq(comments.id, id!));
			else
				throw new Error(
					`Not Comment Owner Or Comment Doesn't Exist id:${id}, userId:${userId}`
				);
		}),
	getReplies: publicProcedure
		.input(SelectReplySchema)
		.query(async ({ ctx: { db }, input: { resourceId, authorId, rootId } }) => {
			return await db
				.select({ ...getTableColumns(comments), profile: { ...getTableColumns(profile) } })
				.from(comments)
				.innerJoin(profile, eq(comments.userId, profile.userId))
				.where(
					and(
						eq(comments.resourceId, resourceId),
						eq(comments.authorId, authorId),
						eq(comments.rootId, rootId!)
					)
				)
				.orderBy(desc(comments.createdAt));
		}),

	getReplyCount: publicProcedure
		.input(SelectReplySchema)
		.query(async ({ ctx: { db }, input: { resourceId, authorId, rootId } }) => {
			const countList = await db
				.select({
					replyCount: count(),
				})
				.from(comments)
				.where(
					and(
						eq(comments.resourceId, resourceId),
						eq(comments.authorId, authorId),
						eq(comments.rootId, rootId!)
					)
				);

			if (countList.length) return countList[0].replyCount;
			else return 0;
		}),
});
