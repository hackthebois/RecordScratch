import { profile, ratings } from "@/server/db/schema";
import { CreateProfileSchema } from "@/types/profile";
import {
	RateFormSchema,
	ResourceSchema,
	ReviewFormSchema,
} from "@/types/rating";
import { clerkClient } from "@clerk/nextjs";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { appendReviewResource } from "../utils";

export const userRouter = router({
	rating: router({
		rate: protectedProcedure
			.input(RateFormSchema)
			.mutation(async ({ ctx: { db, userId }, input: userRating }) => {
				await db
					.insert(ratings)
					.values({ ...userRating, userId })
					.onDuplicateKeyUpdate({
						set: { ...userRating, userId },
					});
			}),
		review: protectedProcedure
			.input(ReviewFormSchema)
			.mutation(async ({ ctx: { db, userId }, input: userRating }) => {
				await db
					.insert(ratings)
					.values({ ...userRating, userId })
					.onDuplicateKeyUpdate({
						set: { ...userRating, userId },
					});
			}),
		get: protectedProcedure
			.input(ResourceSchema)
			.query(
				async ({
					ctx: { userId, db },
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
		delete: protectedProcedure
			.input(ResourceSchema)
			.mutation(
				async ({
					ctx: { userId, db },
					input: { resourceId, category },
				}) => {
					await db
						.delete(ratings)
						.where(
							and(
								eq(ratings.userId, userId),
								eq(ratings.resourceId, resourceId),
								eq(ratings.category, category)
							)
						);
				}
			),
	}),
	me: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return await clerkClient.users.getUser(userId);
	}),
	recent: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				rating: z.number().optional(),
				page: z.number().optional(),
				limit: z.number().optional(),
			})
		)
		.query(
			async ({
				ctx: { db },
				input: { userId, rating, page = 1, limit = 50 },
			}) => {
				const where = rating
					? and(
							eq(ratings.userId, userId),
							eq(ratings.rating, rating)
					  )
					: eq(ratings.userId, userId);

				const ratingList = await db.query.ratings.findMany({
					limit,
					offset: (page - 1) * limit,
					orderBy: desc(ratings.updatedAt),
					where,
					with: {
						profile: true,
					},
				});
				return await appendReviewResource(ratingList, userId);
			}
		),
	profile: router({
		me: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
			return (
				(await db.query.profile.findFirst({
					where: eq(ratings.userId, userId),
				})) ?? null
			);
		}),
		getUniqueHandles: publicProcedure.query(async ({ ctx: { db } }) => {
			const handles = await db
				.select({
					handle: profile.handle,
				})
				.from(profile)
				.groupBy(profile.handle);
			return handles.map(({ handle }) => handle);
		}),
		get: publicProcedure
			.input(z.object({ handle: z.string() }))
			.query(async ({ ctx: { db }, input: { handle } }) => {
				return (
					(await db.query.profile.findFirst({
						where: eq(profile.handle, handle),
					})) ?? null
				);
			}),
		create: protectedProcedure
			.input(CreateProfileSchema)
			.mutation(async ({ ctx: { db, userId }, input: newProfile }) => {
				await db.insert(profile).values({ ...newProfile, userId });
				await clerkClient.users.updateUser(userId, {
					publicMetadata: { onboarded: true },
				});
			}),
		update: protectedProcedure
			.input(CreateProfileSchema)
			.mutation(async ({ ctx: { db, userId }, input: newProfile }) => {
				await db
					.update(profile)
					.set(newProfile)
					.where(eq(profile.userId, userId));
			}),
		handleExists: publicProcedure
			.input(z.string())
			.query(async ({ ctx: { db }, input: handle }) => {
				const exists = !!(await db.query.profile.findFirst({
					where: eq(profile.handle, handle),
				}));
				return exists ? true : false;
			}),
		distribution: publicProcedure
			.input(z.string())
			.query(async ({ ctx: { db }, input: userId }) => {
				const userRatings = await db
					.select({
						rating: ratings.rating,
						rating_count: count(ratings.rating),
					})
					.from(ratings)
					.where(eq(ratings.userId, userId))
					.groupBy(ratings.rating)
					.orderBy(ratings.rating);

				const outputList: number[] = userRatings.reduce(
					(result, { rating, rating_count }) => {
						result[rating - 1] = rating_count;
						return result;
					},
					Array(10).fill(0)
				);

				return outputList;
			}),
	}),
});
