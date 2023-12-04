import { ratings } from "@/server/db/schema";
import { RatingSchema, ResourceSchema } from "@/types/ratings";
import { and, eq } from "drizzle-orm";
import { protectedProcedure, router } from "./trpc";

export const userRouter = router({
	rating: router({
		rate: protectedProcedure
			.input(RatingSchema.omit({ userId: true }))
			.mutation(async ({ ctx: { db, userId }, input: userRating }) => {
				return db
					.insert(ratings)
					.values({ ...userRating, userId })
					.onDuplicateKeyUpdate({
						set: { ...userRating, userId },
					});
			}),
		get: protectedProcedure
			.input(ResourceSchema)
			.query(async ({ ctx: { userId, db }, input: { resourceId } }) => {
				return await db.query.ratings.findFirst({
					where: and(
						eq(ratings.userId, userId),
						eq(ratings.resourceId, resourceId)
					),
				});
			}),
		delete: protectedProcedure
			.input(ResourceSchema)
			.mutation(
				async ({ ctx: { userId, db }, input: { resourceId } }) => {
					await db
						.delete(ratings)
						.where(
							and(
								eq(ratings.userId, userId),
								eq(ratings.resourceId, resourceId)
							)
						);
				}
			),
	}),
});
