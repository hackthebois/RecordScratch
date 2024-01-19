import "server-only";

import { serverTrpc, staticTrpc } from "@/trpc/server";
import { Resource } from "@/types/rating";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { RouterInput } from "../app/actions";

// SPOTIFY
export const spotifyRevalidate = 60 * 60 * 24; // 24 hours

export const getAlbum = cache((albumId: string) => {
	return unstable_cache(
		() => staticTrpc.resource.album.get(albumId),
		[`resource:album:get:${albumId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getArtist = cache((artistId: string) => {
	return unstable_cache(
		() => staticTrpc.resource.artist.get(artistId),
		[`resource:artist:get:${artistId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getArtistTopTracks = cache((artistId: string) => {
	return unstable_cache(
		() => staticTrpc.resource.artist.topTracks(artistId),
		[`resource:artist:getTopTracks:${artistId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getNewReleases = cache(() => {
	return unstable_cache(
		() => staticTrpc.resource.album.newReleases(),
		[`resource:album:getNewReleases`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getSong = cache((songId: string) => {
	return unstable_cache(
		() => staticTrpc.resource.song.get(songId),
		[`resource:song:get:${songId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

export const getArtistDiscography = cache((artistId: string) => {
	return unstable_cache(
		() => staticTrpc.resource.artist.albums(artistId),
		[`resource:artist:getDiscography:${artistId}`],
		{ revalidate: spotifyRevalidate }
	)();
});

// RECORDSCRATCH
export const getCommunityReviews = cache(
	(input: RouterInput["resource"]["rating"]["community"]) => {
		return unstable_cache(
			() => serverTrpc.resource.rating.community.query(input),
			[`resource:rating:community:${input.resource.resourceId}`],
			{ tags: [input.resource.resourceId] }
		)();
	}
);

export const getRating = cache((resource: Resource) => {
	return unstable_cache(
		() => serverTrpc.resource.rating.get.query(resource),
		[`resource:rating:get:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId] }
	)();
});

export const getUserRating = cache((resource: Resource, userId: string) => {
	return unstable_cache(
		() => serverTrpc.user.rating.get.query(resource),
		[`user:${userId}:rating:get:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId, userId] }
	)();
});

export const getRatingsList = cache((resources: Resource[]) => {
	return unstable_cache(
		() => serverTrpc.resource.rating.getList.query(resources),
		[
			`resource:rating:getList:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getUserRatingList = cache(
	(resources: Resource[], userId: string) => {
		return unstable_cache(
			() => serverTrpc.user.rating.getList.query(resources),
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

export const getTrending = cache(() => {
	return unstable_cache(
		() => serverTrpc.resource.album.trending.query(),
		[`resource:album:getTrending`],
		{ revalidate: 60 * 60 }
	)();
});

export const getTopRated = cache(() => {
	return unstable_cache(
		() => serverTrpc.resource.album.top.query(),
		[`resource:album:getTopRated`],
		{ revalidate: 60 * 60 }
	)();
});

export const getFeed = cache(
	(input: RouterInput["resource"]["rating"]["feed"]) => {
		return unstable_cache(
			() => serverTrpc.resource.rating.feed.query(input),
			[`resource:rating:getFeed:page:${input.page}`],
			{
				revalidate: 60,
			}
		)();
	}
);

export const getRatingListAverage = cache((resources: Resource[]) => {
	return unstable_cache(
		() => serverTrpc.resource.rating.getListAverage.query(resources),
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
		() => serverTrpc.user.profile.get.query({ handle }),
		[`user:profile:get:${handle}`],
		{ tags: [handle], revalidate: 60 }
	)();
});

export const getMyProfile = cache((userId: string) => {
	return unstable_cache(
		() => serverTrpc.user.profile.me.query(),
		[`user:${userId}:profile:get:me`],
		{ tags: [userId], revalidate: 60 }
	)();
});

export const getRecent = cache((input: RouterInput["user"]["recent"]) => {
	return unstable_cache(
		() => serverTrpc.user.recent.query(input),
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
		() => serverTrpc.user.profile.distribution.query(userId),
		[`user:profile:distribution:${userId}`],
		{ tags: [userId] }
	)();
});
