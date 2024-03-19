import { likes } from "@/server/db/schema";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";

export const SelectLikeSchema = z.object({
	resourceId: z.string(),
	authorId: z.string(),
});

export const likesRouter = router({
	getLikes: publicProcedure
		.input(SelectLikeSchema)
		.query(async ({ ctx: { db }, input: { resourceId, authorId } }) => {
			const countList = await db
				.select({
					count: count(),
				})
				.from(likes)
				.where(
					and(
						eq(likes.resourceId, resourceId),
						eq(likes.authorId, authorId)
					)
				);
			return countList[0].count;
		}),
	like: protectedProcedure
		.input(SelectLikeSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			await db.insert(likes).values({
				userId,
				...input,
			});
		}),
	unlike: protectedProcedure
		.input(SelectLikeSchema)
		.mutation(
			async ({
				ctx: { db, userId },
				input: { resourceId, authorId },
			}) => {
				await db
					.delete(likes)
					.where(
						and(
							eq(likes.userId, userId),
							eq(likes.resourceId, resourceId),
							eq(likes.authorId, authorId)
						)
					);
			}
		),
	get: protectedProcedure
		.input(SelectLikeSchema)
		.query(
			async ({
				ctx: { db, userId },
				input: { resourceId, authorId },
			}) => {
				const like = await db.query.likes.findFirst({
					where: and(
						eq(likes.userId, userId),
						eq(likes.resourceId, resourceId),
						eq(likes.authorId, authorId)
					),
				});
				return like ? like : null;
			}
		),
});
