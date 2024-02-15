import { followers, profile, ratings } from "app/server/db/schema";
import { protectedProcedure, publicProcedure, router } from "app/server/trpc";
import { and, count, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const profilesRouter = router({
	get: publicProcedure.input(z.string()).query(async ({ ctx: { db }, input: handle }) => {
		return (
			(await db.query.profile.findFirst({
				where: eq(profile.handle, handle),
			})) ?? null
		);
	}),
	me: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		return (
			(await db.query.profile.findFirst({
				where: eq(profile.userId, userId),
			})) ?? null
		);
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

			const outputList: number[] = userRatings.reduce((result, { rating, rating_count }) => {
				result[rating - 1] = rating_count;
				return result;
			}, Array(10).fill(0));

			return outputList;
		}),
	followCount: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				type: z.literal("followers").or(z.literal("following")),
			})
		)
		.query(async ({ ctx: { db }, input: { userId, type } }) => {
			const userExists = !!(await db.query.profile.findFirst({
				where: eq(profile.userId, userId),
			}));

			if (!userExists) throw new Error("User Doesn't Exist");

			let count;
			if (type === "followers") {
				count = await db
					.select({
						count: sql<number>`count(*)`.mapWith(Number),
					})
					.from(followers)
					.where(eq(followers.followingId, userId));
			} else {
				count = await db
					.select({
						count: sql<number>`count(*)`.mapWith(Number),
					})
					.from(followers)
					.where(eq(followers.userId, userId));
			}
			return count.length ? count[0].count : 0;
		}),
	following: protectedProcedure
		.input(z.string())
		.query(async ({ ctx: { db, userId }, input: followingId }) => {
			if (!userId || userId === followingId) return false;

			return !!(await db.query.followers.findFirst({
				where: and(eq(followers.userId, userId), eq(followers.followingId, followingId)),
			}));
		}),
	followProfiles: publicProcedure
		.input(
			z.object({
				profileId: z.string(),
				type: z.literal("followers").or(z.literal("following")),
			})
		)
		.query(async ({ ctx: { db, userId }, input: { profileId, type } }) => {
			const userExists = !!(await db.query.profile.findFirst({
				where: eq(profile.userId, profileId),
			}));

			console.log(`\n\n\n${userExists}\n\n\n`);

			if (!userExists) throw new Error("User Doesn't Exist");

			if (type === "followers") {
				const data = await db.query.followers.findMany({
					where: eq(followers.followingId, profileId),
					with: {
						user: {
							extras: {
								isFollowing:
									sql<boolean>`exists(select 1 from followers where user_id = ${userId} and following_id = ${followers.userId})`.as(
										"isFollowing"
									),
							},
						},
					},
				});
				return data.map(({ user: profile, userId, followingId }) => {
					return {
						userId,
						followingId,
						profile,
					};
				});
			} else {
				const data = await db.query.followers.findMany({
					where: eq(followers.userId, profileId),
					with: {
						following: {
							extras: {
								isFollowing:
									sql<boolean>`exists(select 1 from followers where user_id = ${userId} and following_id = ${followers.userId})`.as(
										"isFollowing"
									),
							},
						},
					},
				});

				return data.map(({ following: profile, userId, followingId }) => {
					return {
						userId,
						followingId,
						profile,
					};
				});
			}
		}),
});
