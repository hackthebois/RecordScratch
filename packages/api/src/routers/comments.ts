import { comments } from "@recordscratch/db";
import {
	CreateCommentSchema,
	DeleteCommentSchema,
	SelectCommentSchema,
} from "@recordscratch/types";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createCommentNotification } from "../notifications";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentsRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(async ({ ctx: { db }, input }) => {
			return await db.query.comments.findFirst({
				where: and(eq(comments.id, input.id)),
				with: {
					profile: true,
					parent: {
						with: {
							profile: true,
						},
					},
					replies: {
						with: {
							profile: true,
							parent: {
								with: {
									profile: true,
								},
							},
						},
					},
				},
			});
		}),
	count: {
		rating: publicProcedure
			.input(SelectCommentSchema)
			.query(async ({ ctx: { db }, input: { resourceId, authorId } }) => {
				const countList = await db
					.select({
						count: count(),
					})
					.from(comments)
					.where(
						and(eq(comments.resourceId, resourceId), eq(comments.authorId, authorId))
					);
				return countList[0].count;
			}),
		reply: publicProcedure
			.input(
				z.object({
					id: z.string(),
				})
			)
			.query(async ({ ctx: { db }, input: { id } }) => {
				const countList = await db
					.select({
						count: count(),
					})
					.from(comments)
					.where(eq(comments.rootId, id));
				return countList[0].count;
			}),
	},
	list: publicProcedure.input(SelectCommentSchema).query(async ({ ctx: { db }, input }) => {
		return await db.query.comments.findMany({
			where: and(
				eq(comments.resourceId, input.resourceId),
				eq(comments.authorId, input.authorId),
				isNull(comments.rootId)
			),
			with: {
				profile: true,
			},
			orderBy: (comments) => [desc(comments.createdAt)],
		});
	}),
	create: protectedProcedure
		.input(CreateCommentSchema)
		.mutation(async ({ ctx: { db, userId }, input: notification }) => {
			const id = uuidv4();

			await Promise.all([
				db.insert(comments).values({ ...notification, userId, id }),
				createCommentNotification(id),
			]);
		}),

	delete: protectedProcedure
		.input(DeleteCommentSchema)
		.mutation(async ({ ctx: { db, userId }, input: { id } }) => {
			await db.delete(comments).where(and(eq(comments.id, id), eq(comments.userId, userId)));
		}),
});
