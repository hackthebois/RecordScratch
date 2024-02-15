"use server";

import { Resource } from "@/recordscratch/types/rating";

import { api } from "@/recordscratch/trpc/server";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { deezer } from "./deezer";

// STATIC
export const getAlbum = cache((albumId: string) =>
	deezer({
		route: "/album/{id}",
		input: { id: albumId },
	})
);

export const getArtist = cache((artistId: string) =>
	deezer({
		route: "/artist/{id}",
		input: { id: artistId },
	})
);

export const getSong = cache((songId: string) =>
	deezer({
		route: "/track/{id}",
		input: { id: songId },
	})
);

export const getTrending = cache(async () => {
	return unstable_cache(() => api.ratings.get.trending(), ["getTrending"], {
		revalidate: 60 * 60,
	})();
});

export const getTopRated = cache(async () => {
	return unstable_cache(() => api.ratings.get.top(), [`getTopRated`], {
		revalidate: 60 * 60,
	})();
});

export const getRecentFeed = cache(
	async ({ page, limit }: { page: number; limit: number }) =>
		api.ratings.get.feed.recent({ page, limit })
);

export const getFollowingFeed = cache(
	async ({ page, limit }: { page: number; limit: number }) =>
		api.ratings.get.feed.following({ page, limit })
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
			() =>
				api.ratings.get.community({
					resource: {
						resourceId,
						category,
					},
					page,
					limit,
				}),
			[`getCommunityReviews:${resourceId}:${page}:${limit}`],
			{ tags: [resourceId] }
		)();
	}
);

export const getRating = cache(({ resourceId, category }: Resource) => {
	return unstable_cache(
		() => api.ratings.get.one({ resourceId, category }),
		[`getRating:${resourceId}`],
		{ revalidate: 60, tags: [resourceId] }
	)();
});

export const getUserRating = cache(
	({ resourceId, category }: Resource, userId: string) => {
		return unstable_cache(
			() => api.ratings.user.get({ resourceId, category }),
			[`getUserRating:${userId}:${resourceId}`],
			{ revalidate: 60, tags: [resourceId, userId] }
		)();
	}
);

export const getRatingsList = cache((resources: Resource[]) => {
	return unstable_cache(
		() => api.ratings.get.list(resources),
		[`getRatingsList:[${resources.map((r) => r.resourceId).join(",")}]`],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getUserRatingList = cache(
	(resources: Resource[], userId: string) => {
		return unstable_cache(
			() => api.ratings.user.getList(resources),
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

export const getProfile = cache((handle: string) => {
	return unstable_cache(
		() => api.profiles.get(handle),
		[`getProfile:${handle}`],
		{ tags: [handle], revalidate: 60 }
	)();
});

export const getMyProfile = cache((userId: string) => {
	return unstable_cache(() => api.profiles.me(), [`getMyProfile:${userId}`], {
		tags: [userId],
		revalidate: 60,
	})();
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
			() =>
				api.ratings.user.recent({
					profileId: userId,
					rating,
					limit,
					page,
					category,
				}),
			[`getRecent:${userId}:${rating}:${page}:${limit}:${category}`],
			{ tags: [userId], revalidate: 60 * 60 }
		)();
	}
);

export const getDistribution = cache((userId: string) => {
	return unstable_cache(
		() => api.profiles.distribution(userId),
		[`getDistribution:${userId}`],
		{ tags: [userId] }
	)();
});

export const getFollowCount = cache(
	async (userId: string, type: "followers" | "following") => {
		return unstable_cache(
			() => api.profiles.followCount({ userId, type }),
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
			() => api.profiles.following(followingId),
			[`isUserFollowing:${followingId}:${userId}`],
			{ tags: [`isUserFollowing:${followingId}:${userId}`] }
		)();
	}
);

export const getFollowProfiles = cache(
	async (
		profileId: string,
		userId: string | null,
		type: "followers" | "following"
	) => {
		return unstable_cache(
			() => api.profiles.followProfiles({ profileId, type }),
			[`getFollowProfiles:${profileId}:${userId}:${type}`],
			{
				tags: [`getFollowProfiles:${profileId}:${userId}:${type}`],
			}
		)();
	}
);
