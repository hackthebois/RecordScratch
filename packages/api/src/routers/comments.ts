import { comments, profile } from "@recordscratch/db";
import {
	CreateCommentSchema,
	DeleteCommentSchema,
	SelectCommentSchema,
	SelectReplySchema,
} from "@recordscratch/types";
import { and, count, desc, eq, or, getTableColumns, isNull } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { alias } from "drizzle-orm/pg-core";
import { createCommentNotification } from "../notifications";

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

			const parentCond = input.parentId
				? eq(comments.parentId, input.parentId)
				: isNull(comments.parentId);

			const id = (
				await db
					.select({ id: comments.id })
					.from(comments)
					.where(
						and(
							eq(comments.resourceId, input.resourceId),
							eq(comments.authorId, input.authorId),
							eq(comments.userId, input.userId),
							parentCond
						)
					)
					.orderBy(desc(comments.createdAt))
			)[0].id;

			if (input.replyUserId != input.authorId && input.authorId != input.userId) {
				await createCommentNotification({
					fromId: input.userId,
					userId: input.authorId,
					type: "COMMENT",
					commentId: id,
				});
			}

			if (input.replyUserId && input.replyUserId != input.userId) {
				await createCommentNotification({
					fromId: input.userId,
					userId: input.replyUserId,
					type: "REPLY",
					commentId: id,
				});
			}
		}),

	delete: protectedProcedure
		.input(DeleteCommentSchema)
		.mutation(async ({ ctx: { db, userId }, input: { id, rootId } }) => {
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
			const profileAlias = alias(profile, "profileAlias");
			const parentUserAlias = alias(profile, "parentUserAlias");
			const parentCommentAlias = alias(comments, "parentCommentAlias");

			return await db
				.select({
					...getTableColumns(comments),
					profile: { ...getTableColumns(profileAlias) },
					parent: { ...getTableColumns(parentUserAlias) },
				})
				.from(comments)
				.innerJoin(profileAlias, eq(comments.userId, profileAlias.userId))
				.innerJoin(parentCommentAlias, eq(parentCommentAlias.id, comments.parentId))
				.innerJoin(parentUserAlias, eq(parentCommentAlias.userId, parentUserAlias.userId))
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
