import { followers, profile, ratings } from "@/server/db/schema";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { CreateProfileSchema, UpdateProfileSchema } from "@/types/profile";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { and, count, eq, like, or, sql } from "drizzle-orm";
import { z } from "zod";

import { RatingSchema } from "@/types/rating";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
	region: process.env.AWS_BUCKET_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_KEY!,
		secretAccessKey: process.env.AWS_SECRET!,
	},
});

export const profilesRouter = router({
	get: publicProcedure
		.input(z.string())
		.query(async ({ ctx: { db }, input: handle }) => {
			return (
				(await db.query.profile.findFirst({
					where: eq(profile.handle, handle),
				})) ?? null
			);
		}),
	me: publicProcedure.query(async ({ ctx: { db, userId } }) => {
		if (!userId) return null;

		return (
			(await db.query.profile.findFirst({
				where: eq(profile.userId, userId),
			})) ?? null
		);
	}),
	needsOnboarding: publicProcedure.query(async ({ ctx: { db, userId } }) => {
		if (!userId) return false;

		return !(await db.query.profile.findFirst({
			where: eq(profile.userId, userId),
		}));
	}),
	distribution: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				category: RatingSchema.shape.category.optional(),
			})
		)
		.query(async ({ ctx: { db }, input: { userId, category } }) => {
			let where;
			if (category)
				where = and(
					eq(ratings.userId, userId),
					eq(ratings.category, category)
				);
			else where = eq(ratings.userId, userId);
			const userRatings = await db
				.select({
					rating: ratings.rating,
					rating_count: count(ratings.rating),
				})
				.from(ratings)
				.where(where)
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
	followCount: publicProcedure
		.input(
			z.object({
				profileId: z.string(),
				type: z.literal("followers").or(z.literal("following")),
			})
		)
		.query(async ({ ctx: { db }, input: { profileId, type } }) => {
			const userExists = !!(await db.query.profile.findFirst({
				where: eq(profile.userId, profileId),
			}));

			if (!userExists) throw new Error("User Doesn't Exist");

			let count;
			if (type === "followers") {
				count = await db
					.select({
						count: sql<number>`count(*)`.mapWith(Number),
					})
					.from(followers)
					.where(eq(followers.followingId, profileId));
			} else {
				count = await db
					.select({
						count: sql<number>`count(*)`.mapWith(Number),
					})
					.from(followers)
					.where(eq(followers.userId, profileId));
			}
			return count.length ? count[0].count : 0;
		}),
	isFollowing: protectedProcedure
		.input(z.string())
		.query(async ({ ctx: { db, userId }, input: followingId }) => {
			if (!userId || userId === followingId) return false;

			return !!(await db.query.followers.findFirst({
				where: and(
					eq(followers.userId, userId),
					eq(followers.followingId, followingId)
				),
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

			if (!userExists) throw new Error("User Doesn't Exist");

			if (type === "followers") {
				const data = await db.query.followers.findMany({
					where: eq(followers.followingId, profileId),
					with: {
						follower: {
							extras: {
								isFollowing:
									sql<boolean>`exists(select 1 from followers where user_id = ${userId} and following_id = ${followers.userId})`.as(
										"isFollowing"
									),
							},
						},
					},
				});
				return data.map(
					({ follower: profile, userId, followingId }) => {
						return {
							userId,
							followingId,
							profile,
						};
					}
				);
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

				return data.map(
					({ following: profile, userId, followingId }) => {
						return {
							userId,
							followingId,
							profile,
						};
					}
				);
			}
		}),
	create: protectedProcedure
		.input(CreateProfileSchema)
		.mutation(async ({ ctx: { db, userId }, input }) => {
			await db.insert(profile).values({ ...input, userId });
		}),
	update: protectedProcedure
		.input(UpdateProfileSchema)
		.mutation(async ({ ctx: { db, userId }, input: newProfile }) => {
			await db
				.update(profile)
				.set({
					...newProfile,
					imageUrl: newProfile.imageUrl
						? `${newProfile.imageUrl}?updatedAt=${new Date().getTime()}`
						: null,
				})
				.where(eq(profile.userId, userId));
		}),
	getSignedURL: protectedProcedure
		.input(
			z.object({
				type: z.string(),
				size: z.number(),
			})
		)
		.mutation(async ({ ctx: { userId }, input: { type, size } }) => {
			const putObjectCommand = new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME!,
				Key: `profile-images/${userId}`,
				ContentType: type,
				ContentLength: size,
				Metadata: {
					userId,
				},
			});

			return await getSignedUrl(s3, putObjectCommand, {
				expiresIn: 60,
			});
		}),
	follow: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx: { db, userId }, input: followingId }) => {
			if (userId === followingId)
				throw new Error("User Cannot Follow Themselves");

			const followExists =
				(
					await db
						.select()
						.from(followers)
						.where(
							and(
								eq(followers.userId, userId),
								eq(followers.followingId, followingId)
							)
						)
				).length > 0;

			if (followExists) throw new Error("User Already Follows");
			else await db.insert(followers).values({ userId, followingId });
		}),
	unFollow: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx: { db, userId }, input: followingId }) => {
			if (userId === followingId)
				throw new Error("User Cannot unFollow Themselves");

			const followExists =
				(
					await db
						.select()
						.from(followers)
						.where(
							and(
								eq(followers.userId, userId),
								eq(followers.followingId, followingId)
							)
						)
				).length > 0;

			if (!followExists) throw new Error("User Doesn't Follow");
			else
				await db
					.delete(followers)
					.where(
						and(
							eq(followers.userId, userId),
							eq(followers.followingId, followingId)
						)
					);
		}),
	handleExists: publicProcedure
		.input(z.string())
		.query(async ({ ctx: { db }, input: handle }) => {
			return !!(await db.query.profile.findFirst({
				where: eq(profile.handle, handle),
			}));
		}),
	search: publicProcedure
		.input(z.string())
		.query(async ({ ctx: { db }, input: query }) => {
			return await db.query.profile.findMany({
				where: or(
					like(profile.handle, `%${query}%`),
					like(profile.name, `%${query}%`)
				),
			});
		}),
});
