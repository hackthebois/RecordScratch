import { followers, ratings } from "@recordscratch/db";
import { RateFormSchema, ResourceSchema, ReviewFormSchema } from "@recordscratch/types";
import { and, avg, count, desc, eq, gt, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { posthog } from "../posthog";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const PaginatedInput = z.object({
	cursor: z.number().min(0).optional(),
	limit: z.number().optional(),
});

export const ratingsRouter = router({
	get: publicProcedure
		.input(ResourceSchema.pick({ resourceId: true, category: true }))
		.query(async ({ ctx: { db }, input: { resourceId, category } }) => {
			const where =
				category === "ARTIST"
					? and(eq(ratings.parentId, resourceId), eq(ratings.category, "ALBUM"))
					: and(eq(ratings.resourceId, resourceId), eq(ratings.category, category));

			const rating = await db
				.select({
					average: avg(ratings.rating),
					total: count(ratings.rating),
				})
				.from(ratings)
				.where(where);
			return rating[0].average ? rating[0] : null;
		}),
	getList: publicProcedure
		.input(
			z.object({
				resourceIds: z.string().array(),
				category: z.enum(["ALBUM", "SONG", "ARTIST"]),
			})
		)
		.query(async ({ ctx: { db }, input: { resourceIds, category } }) => {
			return await db
				.select({
					average: avg(ratings.rating),
					total: count(ratings.rating),
					resourceId: ratings.resourceId,
				})
				.from(ratings)
				.where(
					and(inArray(ratings.resourceId, resourceIds), eq(ratings.category, category))
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
				total: count(ratings.rating),
				average: avg(ratings.rating),
				resourceId: ratings.resourceId,
			})
			.from(ratings)
			.where(eq(ratings.category, "ALBUM"))
			.groupBy(ratings.resourceId)
			.orderBy(({ average }) => desc(average))
			.having(({ total }) => gt(total, 2))
			.limit(20);
	}),
	feed: router({
		recent: publicProcedure
			.input(PaginatedInput)
			.query(async ({ ctx: { db }, input: { limit = 20, cursor = 0 } }) => {
				const items = await db.query.ratings.findMany({
					where: isNotNull(ratings.content),
					limit: limit + 1,
					offset: cursor,
					orderBy: (ratings, { desc }) => [desc(ratings.updatedAt)],
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
			}),
		following: protectedProcedure
			.input(PaginatedInput)
			.query(async ({ ctx: { db, userId }, input: { limit = 20, cursor = 0 } }) => {
				const following = await db.query.followers.findMany({
					where: eq(followers.userId, userId),
				});

				if (following.length === 0)
					return {
						items: [],
						nextCursor: undefined,
					};

				const items = await db.query.ratings.findMany({
					where: and(
						inArray(
							ratings.userId,
							following.map((f) => f.followingId)
						),
						isNotNull(ratings.content)
					),
					limit: limit + 1,
					offset: cursor,
					orderBy: (ratings, { desc }) => [desc(ratings.updatedAt)],
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
					orderBy: (ratings, { desc }) => [desc(ratings.updatedAt)],
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
		get: publicProcedure
			.input(z.object({ resourceId: z.string(), userId: z.string() }))
			.query(async ({ ctx: { db }, input: { resourceId, userId } }) => {
				const userRating = await db.query.ratings.findFirst({
					where: and(eq(ratings.resourceId, resourceId), eq(ratings.userId, userId)),
				});
				return userRating ? userRating : null;
			}),
		getList: protectedProcedure
			.input(
				z.object({
					resourceIds: z.string().array(),
					category: z.enum(["ALBUM", "SONG", "ARTIST"]),
				})
			)
			.query(async ({ ctx: { db, userId }, input: { resourceIds, category } }) => {
				return await db.query.ratings.findMany({
					where: and(
						inArray(ratings.resourceId, resourceIds),
						eq(ratings.userId, userId),
						eq(ratings.category, category)
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
					input: { limit = 20, cursor = 0, rating, category, profileId },
				}) => {
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

					const items = await db.query.ratings.findMany({
						limit: limit + 1,
						offset: cursor,
						orderBy: desc(ratings.updatedAt),
						where,
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
	rate: protectedProcedure
		.input(RateFormSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			const { rating, resourceId, parentId, category } = input;
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
					.values({
						rating,
						resourceId,
						category,
						userId,
						parentId,
					})
					.onConflictDoUpdate({
						target: [ratings.resourceId, ratings.userId],
						set: {
							rating,
							resourceId,
							category,
							userId,
							parentId,
						},
					});
			}
			posthog("rate", {
				distinctId: userId,
				properties: input,
			});
		}),
	review: protectedProcedure
		.input(ReviewFormSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			await db
				.insert(ratings)
				.values({ ...input, userId })
				.onConflictDoUpdate({
					target: [ratings.resourceId, ratings.userId],
					set: { ...input, userId },
				});
			posthog("review", {
				distinctId: userId,
				properties: input,
			});
		}),
});
