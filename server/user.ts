import { profile, ratings } from "@/server/db/schema";
import { ProfileSchema } from "@/types/profile";
import { RateSchema, ResourceSchema, ReviewSchema } from "@/types/rating";
import { clerkClient } from "@clerk/nextjs";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";

export const userRouter = router({
	rating: router({
		rate: protectedProcedure
			.input(RateSchema)
			.mutation(async ({ ctx: { db, userId }, input: userRating }) => {
				await db
					.insert(ratings)
					.values({ ...userRating, userId })
					.onDuplicateKeyUpdate({
						set: { ...userRating, userId },
					});
			}),
		review: protectedProcedure
			.input(ReviewSchema)
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
			.query(async ({ ctx: { db }, input: resources }) => {
				return await db.query.ratings.findMany({
					where: inArray(
						ratings.resourceId,
						resources.map((r) => r.resourceId)
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
	recent: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		return await db.query.ratings.findMany({
			limit: 10,
			orderBy: desc(ratings.updatedAt),
			where: eq(ratings.userId, userId),
		});
	}),
	profile: router({
		me: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
			return await db.query.profile.findFirst({
				where: eq(ratings.userId, userId),
			});
		}),
		get: publicProcedure
			.input(z.string())
			.query(async ({ ctx: { db }, input: userId }) => {
				return await db.query.profile.findFirst({
					where: eq(ratings.userId, userId),
				});
			}),
		create: protectedProcedure
			.input(
				ProfileSchema.pick({
					name: true,
					handle: true,
					imageUrl: true,
				})
			)
			.mutation(async ({ ctx: { db, userId }, input: newProfile }) => {
				await db.insert(profile).values({ ...newProfile, userId });
				await clerkClient.users.updateUser(userId, {
					publicMetadata: { onboarded: true },
				});
			}),
	}),
});
