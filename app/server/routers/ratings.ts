import { followers, ratings } from "app/server/db/schema";
import { protectedProcedure, publicProcedure, router } from "app/server/trpc";
import { RateFormSchema, ResourceSchema, ReviewFormSchema } from "app/types/rating";
import { and, avg, count, desc, eq, gt, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";

const PaginatedInput = z.object({
	cursor: z.number().min(1).max(100).optional(),
	limit: z.number().optional(),
});

export const ratingsRouter = router({
	get: publicProcedure
		.input(ResourceSchema)
		.query(async ({ ctx: { db }, input: { resourceId, category } }) => {
			const rating = await db
				.select({
					average: avg(ratings.rating),
					total: count(ratings.rating),
				})
				.from(ratings)
				.where(and(eq(ratings.resourceId, resourceId), eq(ratings.category, category)));
			return { ...rating[0], resourceId };
		}),
	list: publicProcedure
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
	trending: publicProcedure.query(async ({ ctx: { db } }) => {
		return await db
			.select({
				total: count(ratings.rating),
				resourceId: ratings.resourceId,
			})
			.from(ratings)
			.where(
				and(
					eq(ratings.category, "ALBUM"),
					gt(ratings.createdAt, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7))
				)
			)
			.groupBy(ratings.resourceId)
			.orderBy(({ total }) => desc(total))
			.limit(20);
	}),
	top: publicProcedure.query(async ({ ctx: { db } }) => {
		return await db
			.select({
				average: avg(ratings.rating),
				resourceId: ratings.resourceId,
			})
			.from(ratings)
			.where(eq(ratings.category, "ALBUM"))
			.groupBy(ratings.resourceId)
			.orderBy(({ average }) => desc(average))
			.limit(20);
	}),
	feed: router({
		recent: publicProcedure
			.input(PaginatedInput)
			.query(async ({ ctx: { db }, input: { limit = 20, page = 1 } }) => {
				return await db.query.ratings.findMany({
					where: isNotNull(ratings.content),
					limit,
					offset: (page - 1) * limit,
					orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
					with: {
						profile: true,
					},
				});
			}),
		following: protectedProcedure
			.input(PaginatedInput)
			.query(async ({ ctx: { db, userId }, input: { limit = 20, page = 1 } }) => {
				const following = await db.query.followers.findMany({
					where: eq(followers.userId, userId),
				});

				if (following.length === 0) return [];

				return await db.query.ratings.findMany({
					where: and(
						inArray(
							ratings.userId,
							following.map((f) => f.followingId)
						),
						isNotNull(ratings.content)
					),
					limit,
					offset: (page - 1) * limit,
					orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
					with: {
						profile: true,
					},
				});
			}),
		community: publicProcedure.input(PaginatedInput.extend({ resource: ResourceSchema })).query(
			async ({
				ctx: { db },
				input: {
					limit = 20,
					cursor = 0,
					resource: { resourceId, category },
				},
			}) => {
				const items = await db.query.ratings.findMany({
					where: and(
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category),
						isNotNull(ratings.content)
					),
					limit: limit + 1,
					offset: cursor,
					orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
					with: {
						profile: true,
					},
				});
				let nextCursor: typeof cursor | undefined = undefined;
				if (items.length > limit) {
					items.pop();
					nextCursor = cursor + items.length;
				}
				return { items, nextCursor };
			}
		),
	}),
	user: router({
		get: protectedProcedure
			.input(ResourceSchema)
			.query(async ({ ctx: { db, userId }, input: { resourceId, category } }) => {
				const userRating = await db.query.ratings.findFirst({
					where: and(
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category),
						eq(ratings.userId, userId)
					),
				});
				return userRating ? userRating : null;
			}),
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
		recent: publicProcedure
			.input(
				PaginatedInput.extend({
					profileId: z.string(),
					rating: z.number().optional(),
					category: z.enum(["ALBUM", "SONG"]).optional(),
				})
			)
			.query(
				async ({
					ctx: { db },
					input: { limit = 20, page = 1, rating, category, profileId },
				}) => {
					if (page < 1) page = 1;

					let where;
					if (rating && category)
						where = and(
							eq(ratings.userId, profileId),
							eq(ratings.rating, rating),
							eq(ratings.category, category)
						);
					else if (category)
						where = and(eq(ratings.userId, profileId), eq(ratings.category, category));
					else if (rating)
						where = and(eq(ratings.userId, profileId), eq(ratings.rating, rating));
					else where = eq(ratings.userId, profileId);

					return await db.query.ratings.findMany({
						limit,
						offset: (page - 1) * limit,
						orderBy: desc(ratings.updatedAt),
						where,
						with: {
							profile: true,
						},
					});
				}
			),
	}),
	rate: protectedProcedure
		.input(RateFormSchema)
		.mutation(async ({ ctx: { db, userId }, input: { rating, resourceId, category } }) => {
			if (rating === null) {
				await db
					.delete(ratings)
					.where(
						and(
							eq(ratings.userId, userId),
							eq(ratings.resourceId, resourceId),
							eq(ratings.category, category)
						)
					);
			} else {
				await db
					.insert(ratings)
					.values({ rating, resourceId, category, userId })
					.onDuplicateKeyUpdate({
						set: { rating, resourceId, category, userId },
					});
			}
		}),
	review: protectedProcedure
		.input(ReviewFormSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			await db
				.insert(ratings)
				.values({ ...input, userId })
				.onDuplicateKeyUpdate({
					set: { ...input, userId },
				});
		}),
});
