"use server";
import "server-only";

import { appendReviewResource } from "@/app/_api/utils";
import { db } from "@/db/db";
import { followers, profile, ratings } from "@/db/schema";
import { Resource } from "@/types/rating";

import { auth } from "@clerk/nextjs";
import {
	and,
	avg,
	count,
	desc,
	eq,
	inArray,
	isNotNull,
	sql,
} from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { Album, spotify } from "./spotify";

// STATIC
export const getAlbum = cache((albumId: string) =>
	spotify({
		route: "/albums/{id}",
		input: { id: albumId },
	})
);

export const getArtist = cache((artistId: string) =>
	spotify({
		route: "/artists/{id}",
		input: { id: artistId },
	})
);

export const getArtistTopTracks = cache((artistId: string) =>
	spotify({
		route: "/artists/{id}/top-tracks",
		input: { id: artistId, market: "US" },
	})
);

export const getNewReleases = cache(() =>
	spotify({
		route: "/browse/new-releases",
		input: undefined,
	})
);

export const getSong = cache((songId: string) =>
	spotify({
		route: "/tracks/{id}",
		input: { id: songId },
	})
);

export const getArtistDiscography = cache(async (artistId: string) => {
	const albums: Album[] = [];
	const getAllAlbums = async (offset = 0) => {
		const newAlbums = await spotify({
			route: "/artists/{id}/albums",
			input: {
				id: artistId,
				include_groups: "album,single",
				offset,
				limit: 50,
			},
		});
		albums.push(...newAlbums.items);
		// TODO: handle this without the extra request for 0 (check next)
		if (newAlbums.items.length !== 0) {
			await getAllAlbums(offset + 50);
		}
	};
	await getAllAlbums();
	return albums;
});

export const getTrending = cache(async () => {
	return unstable_cache(
		async () => {
			console.log("getTrending");
			const albums = await db
				.select({
					total: count(ratings.rating),
					resourceId: ratings.resourceId,
				})
				.from(ratings)
				.where(eq(ratings.category, "ALBUM"))
				.groupBy(ratings.resourceId)
				.orderBy(({ total }) => desc(total))
				.limit(20);
			if (albums.length === 0)
				return {
					albums: [],
				};
			return await spotify({
				route: "/albums",
				input: { ids: albums.map((a) => a.resourceId) },
			});
		},
		["getTrending"],
		{ revalidate: 60 * 60 }
	)();
});

export const getTopRated = cache(async () => {
	return unstable_cache(
		async () => {
			const albums = await db
				.select({
					average: avg(ratings.rating),
					resourceId: ratings.resourceId,
				})
				.from(ratings)
				.where(eq(ratings.category, "ALBUM"))
				.groupBy(ratings.resourceId)
				.orderBy(({ average }) => desc(average))
				.limit(20);
			if (albums.length === 0)
				return {
					albums: [],
				};
			return await spotify({
				route: "/albums",
				input: { ids: albums.map((a) => a.resourceId) },
			});
		},
		[`getTopRated`],
		{ revalidate: 60 * 60 }
	)();
});

export const getRecentFeed = cache(
	async ({ page, limit }: { page: number; limit: number }) => {
		const ratingList = await db.query.ratings.findMany({
			limit,
			offset: (page - 1) * limit,
			orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
			with: {
				profile: true,
			},
		});
		return await appendReviewResource(ratingList);
	}
);

export const getFollowingFeed = cache(
	async ({ page, limit }: { page: number; limit: number }) => {
		const { userId } = auth();

		if (!userId) return [];

		const following = await db.query.followers.findMany({
			where: eq(followers.userId, userId),
		});

		if (following.length === 0) return [];

		const ratingList = await db.query.ratings.findMany({
			where: inArray(
				ratings.userId,
				following.map((f) => f.followingId)
			),
			limit,
			offset: (page - 1) * limit,
			orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
			with: {
				profile: true,
			},
		});
		return await appendReviewResource(ratingList);
	}
);

// RECORDSCRATCH
export const getCommunityReviews = cache(
	({
		resource: { resourceId, category },
		page,
		limit,
	}: {
		resource: Resource;
		page: number;
		limit: number;
	}) => {
		return unstable_cache(
			async () => {
				console.log(
					"getCommunityReviews",
					resourceId,
					category,
					page,
					limit
				);
				const ratingList = await db.query.ratings.findMany({
					where: and(
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category),
						isNotNull(ratings.content)
					),
					limit,
					offset: (page - 1) * limit,
					orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
					with: {
						profile: true,
					},
				});
				return await appendReviewResource(ratingList);
			},
			[`getCommunityReviews:${resourceId}:${page}:${limit}`],
			{ tags: [resourceId] }
		)();
	}
);

export const getRating = cache(({ resourceId, category }: Resource) => {
	return unstable_cache(
		async () => {
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
		},
		[`getRating:${resourceId}`],
		{ revalidate: 60, tags: [resourceId] }
	)();
});

export const getUserRating = cache(
	({ resourceId, category }: Resource, userId: string) => {
		return unstable_cache(
			async () => {
				const userRating = await db.query.ratings.findFirst({
					where: and(
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category),
						eq(ratings.userId, userId)
					),
				});
				return userRating ? userRating : null;
			},
			[`getUserRating:${userId}:${resourceId}`],
			{ revalidate: 60, tags: [resourceId, userId] }
		)();
	}
);

export const getRatingsList = cache((resources: Resource[]) => {
	return unstable_cache(
		async () => {
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
		},
		[`getRatingsList:[${resources.map((r) => r.resourceId).join(",")}]`],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getUserRatingList = cache(
	(resources: Resource[], userId: string) => {
		return unstable_cache(
			async () => {
				return await db.query.ratings.findMany({
					where: and(
						inArray(
							ratings.resourceId,
							resources.map((r) => r.resourceId)
						),
						eq(ratings.userId, userId)
					),
				});
			},
			[
				`getUserRatingList:${userId}:[${resources
					.map((r) => r.resourceId)
					.join(",")}]`,
			],
			{
				tags: [...resources.map((r) => r.resourceId), userId],
				revalidate: 60,
			}
		)();
	}
);

export const getRatingListAverage = cache((resources: Resource[]) => {
	return unstable_cache(
		async () => {
			const rating = await db
				.select({
					average: avg(ratings.rating),
					total: count(ratings.rating),
				})
				.from(ratings)
				.where(
					inArray(
						ratings.resourceId,
						resources.map((a) => a.resourceId)
					)
				);
			return rating[0];
		},
		[
			`getRatingListAverage:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getProfile = cache((handle: string) => {
	return unstable_cache(
		async () => {
			return (
				(await db.query.profile.findFirst({
					where: eq(profile.handle, handle),
				})) ?? null
			);
		},
		[`getProfile:${handle}`],
		{ tags: [handle], revalidate: 60 }
	)();
});

export const getMyProfile = cache((userId: string) => {
	return unstable_cache(
		async () => {
			return (
				(await db.query.profile.findFirst({
					where: eq(ratings.userId, userId),
				})) ?? null
			);
		},
		[`getMyProfile:${userId}`],
		{ tags: [userId], revalidate: 60 }
	)();
});

export const getRecent = cache(
	async ({
		rating,
		userId,
		limit = 15,
		page = 1,
		category,
	}: {
		rating?: number;
		userId: string;
		limit?: number;
		page?: number;
		category?: "ALBUM" | "SONG";
	}) => {
		return unstable_cache(
			async () => {
				if (page < 1) page = 1;

				var where;
				if (rating && category)
					where = and(
						eq(ratings.userId, userId),
						eq(ratings.rating, rating),
						eq(ratings.category, category)
					);
				else if (category)
					where = and(
						eq(ratings.userId, userId),
						eq(ratings.category, category)
					);
				else if (rating)
					where = and(
						eq(ratings.userId, userId),
						eq(ratings.rating, rating)
					);
				else where = eq(ratings.userId, userId);

				const ratingList = await db.query.ratings.findMany({
					limit,
					offset: (page - 1) * limit,
					orderBy: desc(ratings.updatedAt),
					where,
					with: {
						profile: true,
					},
				});

				return await appendReviewResource(ratingList);
			},
			[`getRecent:${userId}:${rating}:${page}:${limit}:${category}`],
			{ tags: [userId], revalidate: 60 * 60 }
		)();
	}
);

export const getDistribution = cache((userId: string) => {
	return unstable_cache(
		async () => {
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
		},
		[`getDistribution:${userId}`],
		{ tags: [userId] }
	)();
});

export const getFollowCount = cache(
	async (userId: string, type: "followers" | "following") => {
		return unstable_cache(
			async () => {
				const userExists = !!(await db.query.profile.findFirst({
					where: eq(profile.userId, userId),
				}));

				if (!userExists) throw new Error("User Doesn't Exist");

				var count;
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
			},
			[`getFollowCount:${userId}:${type}`],
			{
				tags: [`getFollowCount:${userId}:${type}`],
			}
		)();
	}
);

export const isUserFollowing = cache(
	async (followingId: string, userId: string | null) => {
		return unstable_cache(
			async () => {
				if (!userId || userId === followingId) return false;

				return !!(await db.query.followers.findFirst({
					where: and(
						eq(followers.userId, userId),
						eq(followers.followingId, followingId)
					),
				}));
			},
			[`isUserFollowing:${followingId}:${userId}`],
			{ tags: [`isUserFollowing:${followingId}:${userId}`] }
		)();
	}
);

export const getFollowProfiles = cache(
	async (profileId: string, type: "followers" | "following") => {
		const userId = auth().userId;
		return unstable_cache(
			async () => {
				const userExists = !!(await db.query.profile.findFirst({
					where: eq(profile.userId, profileId),
				}));

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
					return data.map(
						({ user: profile, userId, followingId }) => {
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
			},
			[`getFollowProfiles:${profileId}:${type}`],
			{
				tags: [`getFollowProfiles:${profileId}:${type}`],
			}
		)();
	}
);
