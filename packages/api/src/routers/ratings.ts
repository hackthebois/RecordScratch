import { followers, likes, ratings } from "@recordscratch/db";
import { RateFormSchema, ResourceSchema, ReviewFormSchema } from "@recordscratch/types";
import dayjs from "dayjs";
import { and, avg, count, desc, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
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
		const data = await db
			.select({
				total: count(ratings.rating),
				average: avg(ratings.rating),
				resourceId: ratings.resourceId,
				sortValue: sql`ROUND(AVG(${ratings.rating}), 1) + CAST(COUNT(${ratings.rating}) as decimal) / 100`,
			})
			.from(ratings)
			.where(eq(ratings.category, "ALBUM"))
			.groupBy(ratings.resourceId)
			.orderBy(({ sortValue }) => desc(sortValue))
			.having(({ total }) => gt(total, 5))
			.limit(20);
		return data;
	}),
	feed: publicProcedure
		.input(
			PaginatedInput.extend({
				filters: z
					.object({
						profileId: z.string().optional(),
						resourceId: ResourceSchema.shape.resourceId.optional(),
						category: ResourceSchema.shape.category.optional(),
						rating: z.number().optional(),
						following: z.boolean().optional(),
						hasReview: z.boolean().optional(),
					})
					.optional(),
			})
		)
		.query(async ({ ctx: { db, userId }, input: { limit = 20, cursor = 0, filters } }) => {
			let followingWhere = undefined;
			if (filters?.following && userId) {
				const following = await db.query.followers.findMany({
					where: eq(followers.userId, userId),
				});

				if (following.length === 0)
					return {
						items: [],
						nextCursor: undefined,
					};

				followingWhere = inArray(
					ratings.userId,
					following.map((f) => f.followingId)
				);
			}

			const items = await db.query.ratings.findMany({
				where: and(
					followingWhere,
					filters?.profileId ? eq(ratings.userId, filters.profileId) : undefined,
					filters?.resourceId ? eq(ratings.resourceId, filters.resourceId) : undefined,
					filters?.category ? eq(ratings.category, filters.category) : undefined,
					filters?.rating ? eq(ratings.rating, filters.rating) : undefined,
					filters?.hasReview ? isNotNull(ratings.content) : undefined
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
	user: router({
		get: publicProcedure
			.input(z.object({ resourceId: z.string(), userId: z.string() }))
			.query(async ({ ctx: { db }, input: { resourceId, userId } }) => {
				const userRating = await db.query.ratings.findFirst({
					where: and(eq(ratings.resourceId, resourceId), eq(ratings.userId, userId)),
				});
				return userRating ? userRating : null;
			}),
		streak: publicProcedure
			.input(z.object({ userId: z.string() }))
			.query(async ({ input: { userId }, ctx: { db } }) => {
				const ratingsList = await db.query.ratings.findMany({
					where: and(eq(ratings.userId, userId), isNotNull(ratings.createdAt)),
					orderBy: desc(ratings.createdAt),
				});

				if (ratingsList.length === 0) {
					return 0;
				}

				if (
					dayjs(dayjs().format("YYYY-MM-DD")).diff(
						dayjs(ratingsList[0].createdAt).format("YYYY-MM-DD"),
						"day"
					) > 1
				) {
					return 0;
				}

				// USE FOR RATING LOG
				const groupedDays = new Map<string, number>();

				ratingsList.forEach((rating) => {
					const date = dayjs(rating.createdAt).format("YYYY-MM-DD");
					if (groupedDays.has(date)) {
						const current = groupedDays.get(date);
						groupedDays.set(date, current ? current + 1 : 1);
					} else {
						groupedDays.set(date, 1);
					}
				});

				const days = Array.from(groupedDays.keys());

				let streak = 1;

				for (let i = 0; i < days.length; i++) {
					if (i === days.length - 1) {
						streak++;
						break;
					}

					const current = dayjs(days[i]);
					const next = dayjs(days[i + 1]);

					if (current.diff(next, "day") <= 2) {
						streak++;
					} else {
						break;
					}
				}

				return streak;
			}),
		total: publicProcedure
			.input(z.object({ userId: z.string() }))
			.query(async ({ input: { userId }, ctx: { db } }) => {
				const total = await db.query.ratings.findMany({
					where: eq(ratings.userId, userId),
				});
				return total.length;
			}),
		totalLikes: publicProcedure
			.input(z.object({ userId: z.string() }))
			.query(async ({ input: { userId }, ctx: { db } }) => {
				const total = await db.query.likes.findMany({
					where: and(eq(likes.authorId, userId)),
				});
				return total.length;
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
	}),
	rate: protectedProcedure
		.input(RateFormSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			const { rating, resourceId, parentId, category, content } = input;
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
						content,
					})
					.onConflictDoUpdate({
						target: [ratings.resourceId, ratings.userId],
						set: {
							rating,
							resourceId,
							category,
							userId,
							parentId,
							content,
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
