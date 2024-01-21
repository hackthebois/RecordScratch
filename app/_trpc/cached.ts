"use server";
import "server-only";

import { api, publicApi } from "@/app/_trpc/server";
import { Resource } from "@/types/rating";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { RouterInput } from "./types";

// PUBLIC
const spotifyRevalidate = 60 * 60 * 24; // 24 hours

export const getAlbum = cache((albumId: string) => {
	return unstable_cache(
		() => publicApi.resource.album.get(albumId),
		[`resource:album:get:${albumId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getArtist = cache((artistId: string) => {
	return unstable_cache(
		() => publicApi.resource.artist.get(artistId),
		[`resource:artist:get:${artistId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getArtistTopTracks = cache((artistId: string) => {
	return unstable_cache(
		() => publicApi.resource.artist.topTracks(artistId),
		[`resource:artist:getTopTracks:${artistId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getNewReleases = cache(() => {
	return unstable_cache(
		() => publicApi.resource.album.newReleases(),
		[`resource:album:getNewReleases`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getSong = cache((songId: string) => {
	return unstable_cache(
		() => publicApi.resource.song.get(songId),
		[`resource:song:get:${songId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getArtistDiscography = cache((artistId: string) => {
	return unstable_cache(
		() => publicApi.resource.artist.albums(artistId),
		[`resource:artist:getDiscography:${artistId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getTrending = cache(() => {
	return unstable_cache(
		() => publicApi.resource.album.trending(),
		[`resource:album:getTrending`],
		{ revalidate: 60 * 60 }
	)();
});

export const getTopRated = cache(() => {
	return unstable_cache(
		() => publicApi.resource.album.top(),
		[`resource:album:getTopRated`],
		{ revalidate: 60 * 60 }
	)();
});

export const getFeed = cache(
	(input: RouterInput["resource"]["rating"]["feed"]) => {
		return unstable_cache(
			() => publicApi.resource.rating.feed(input),
			[`resource:rating:getFeed:page:${input.page}`],
			{
				revalidate: 60,
			}
		)();
	}
);

export const getCommunityReviews = cache(
	(input: RouterInput["resource"]["rating"]["community"]) => {
		return unstable_cache(
			() => publicApi.resource.rating.community(input),
			[`resource:rating:community:${input.resource.resourceId}`],
			{ tags: [input.resource.resourceId] }
		)();
	}
);

export const getRatingListAverage = cache((resources: Resource[]) => {
	return unstable_cache(
		() => publicApi.resource.rating.getListAverage(resources),
		[
			`resource:rating:getListAverage:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getProfile = cache((handle: string) => {
	return unstable_cache(
		() => publicApi.user.profile.get({ handle }),
		[`user:profile:get:${handle}`],
		{ tags: [handle], revalidate: 60 }
	)();
});

export const getMyProfile = cache((userId: string) => {
	return unstable_cache(
		() => api.user.profile.me(),
		[`user:${userId}:profile:get:me`],
		{ tags: [userId], revalidate: 60 }
	)();
});

export const getRecent = cache((input: RouterInput["user"]["recent"]) => {
	return unstable_cache(
		() => publicApi.user.recent(input),
		[
			`user:recent:get:${input.userId}${
				input.rating ? `:${input.rating}` : ""
			}`,
		],
		{ tags: [input.userId, "recent"] }
	)();
});

export const getDistribution = cache((userId: string) => {
	return unstable_cache(
		() => publicApi.user.profile.distribution(userId),
		[`user:profile:distribution:${userId}`],
		{ tags: [userId] }
	)();
});

export const getRating = cache((resource: Resource) => {
	return unstable_cache(
		() => publicApi.resource.rating.get(resource),
		[`resource:rating:get:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId] }
	)();
});

export const getRatingsList = cache((resources: Resource[]) => {
	return unstable_cache(
		() => publicApi.resource.rating.getList(resources),
		[
			`resource:rating:getList:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

// APP

export const getUserRating = cache((resource: Resource, userId: string) => {
	return unstable_cache(
		() => api.user.rating.get(resource),
		[`user:${userId}:rating:get:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId, userId] }
	)();
});

export const getUserRatingList = cache(
	(resources: Resource[], userId: string) => {
		return unstable_cache(
			() => api.user.rating.getList(resources),
			[
				`user:${userId}:rating:getList:[${resources
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
