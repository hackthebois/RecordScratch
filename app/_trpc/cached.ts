"use server";

import { serverTrpc } from "@/app/_trpc/server";
import { Resource } from "@/types/rating";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { RouterInput } from "../actions";

export const getAlbum = cache((albumId: string) => {
	return unstable_cache(
		() => serverTrpc.resource.album.get(albumId),
		[`resource:album:get:${albumId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getArtist = cache((artistId: string) => {
	return unstable_cache(
		() => serverTrpc.resource.artist.get(artistId),
		[`resource:artist:get:${artistId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getArtistTopTracks = cache((artistId: string) => {
	return unstable_cache(
		() => serverTrpc.resource.artist.topTracks(artistId),
		[`resource:artist:getTopTracks:${artistId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getArtistDiscography = cache((artistId: string) => {
	return unstable_cache(
		() => serverTrpc.resource.artist.albums(artistId),
		[`resource:artist:getDiscography:${artistId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getCommunityReviews = cache(
	(input: RouterInput["resource"]["rating"]["community"]) => {
		return unstable_cache(
			() => serverTrpc.resource.rating.community(input),
			[`resource:rating:community:${input.resource.resourceId}`],
			{ tags: [input.resource.resourceId] }
		)();
	}
);

export const getRating = cache((resource: Resource) => {
	return unstable_cache(
		() => serverTrpc.resource.rating.get(resource),
		[`resource:rating:get:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId] }
	)();
});

export const getUserRating = cache((resource: Resource, userId: string) => {
	return unstable_cache(
		() => serverTrpc.user.rating.get(resource),
		[`user:${userId}:rating:get:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId, userId] }
	)();
});

export const getRatingsList = cache((resources: Resource[]) => {
	return unstable_cache(
		() => serverTrpc.resource.rating.getList(resources),
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
			() => serverTrpc.user.rating.getList(resources),
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

export const getNewReleases = cache(() => {
	return unstable_cache(
		() => serverTrpc.resource.album.newReleases(),
		[`resource:album:getNewReleases`],
		{ revalidate: 60 * 10 }
	)();
});

export const getTrending = cache(() => {
	return unstable_cache(
		() => serverTrpc.resource.album.trending(),
		[`resource:album:getTrending`],
		{ revalidate: 60 * 10 }
	)();
});

export const getTopRated = cache(() => {
	return unstable_cache(
		() => serverTrpc.resource.album.top(),
		[`resource:album:getTopRated`],
		{ revalidate: 60 * 10 }
	)();
});

export const getFeed = cache(
	(input: RouterInput["resource"]["rating"]["feed"]) => {
		return unstable_cache(
			() => serverTrpc.resource.rating.feed(input),
			[`resource:rating:getFeed:page:${input.page}`],
			{}
		)();
	}
);

export const getRatingListAverage = cache((resources: Resource[]) => {
	return unstable_cache(
		() => serverTrpc.resource.rating.getListAverage(resources),
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
		() => serverTrpc.user.profile.get({ handle }),
		[`user:profile:get:${handle}`],
		{ tags: [handle], revalidate: 60 }
	)();
});

export const getMyProfile = cache((userId: string) => {
	return unstable_cache(
		() => serverTrpc.user.profile.me(),
		[`user:${userId}:profile:get:me`],
		{ tags: [userId], revalidate: 60 }
	)();
});

export const getRecent = cache((input: RouterInput["user"]["recent"]) => {
	return unstable_cache(
		() => serverTrpc.user.recent(input),
		[
			`user:recent:get:${input.userId}${
				input.rating ? `:${input.rating}` : ""
			}`,
		],
		{ tags: [input.userId] }
	)();
});

export const getSong = cache((songId: string) => {
	return unstable_cache(
		() => serverTrpc.resource.song.get(songId),
		[`resource:song:get:${songId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getDistribution = cache((userId: string) => {
	return unstable_cache(
		() => serverTrpc.user.profile.distribution(userId),
		[`user:profile:distribution:${userId}`],
		{ tags: [userId] }
	)();
});
