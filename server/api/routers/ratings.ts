import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { ratings } from "@/server/db/schema";
import { ResourceSchema } from "@/types/rating";
import { and, avg, count, eq, inArray } from "drizzle-orm";

export const ratingsRouter = createTRPCRouter({
	resource: {
		get: publicProcedure
			.input(ResourceSchema)
			.query(async ({ ctx: { db }, input: { resourceId, category } }) => {
				const rating = await db
					.select({
						average: avg(ratings.rating),
						total: count(ratings.rating),
					})
					.from(ratings)
					.where(
						and(
							eq(ratings.resourceId, resourceId),
							eq(ratings.category, category)
						)
					);
				return { ...rating[0], resourceId };
			}),
		getList: publicProcedure
			.input(ResourceSchema.array())
			.query(async ({ ctx: { db }, input: resources }) => {
				return await db
					.select({
						average: avg(ratings.rating),
						total: count(ratings.rating),
						resourceId: ratings.resourceId,
					})
					.from(ratings)
					.where(
						inArray(
							ratings.resourceId,
							resources.map((r) => r.resourceId)
						)
					)
					.groupBy(ratings.resourceId);
			}),
	},
	user: {
		get: protectedProcedure
			.input(ResourceSchema)
			.query(
				async ({
					ctx: { db, userId },
					input: { resourceId, category },
				}) => {
					const userRating = await db.query.ratings.findFirst({
						where: and(
							eq(ratings.resourceId, resourceId),
							eq(ratings.category, category),
							eq(ratings.userId, userId)
						),
					});
					return userRating ? userRating : null;
				}
			),
		getList: protectedProcedure
			.input(ResourceSchema.array())
			.query(async ({ ctx: { db, userId }, input: resources }) => {
				return await db.query.ratings.findMany({
					where: and(
						inArray(
							ratings.resourceId,
							resources.map((r) => r.resourceId)
						),
						eq(ratings.userId, userId)
					),
				});
			}),
	},
});
