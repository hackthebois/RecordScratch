import { serverTrpc } from "@/app/_trpc/server";
import { Resource } from "@/types/rating";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getAlbum = cache((albumId: string) => {
	return unstable_cache(
		async () => await serverTrpc.resource.album.get(albumId),
		[`resource:album:get:${albumId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getArtist = cache((artistId: string) => {
	return unstable_cache(
		async () => await serverTrpc.resource.artist.get(artistId),
		[`resource:artist:get:${artistId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getArtistTopTracks = cache((artistId: string) => {
	return unstable_cache(
		async () => await serverTrpc.resource.artist.topTracks(artistId),
		[`resource:artist:getTopTracks:${artistId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getArtistDiscography = cache((artistId: string) => {
	return unstable_cache(
		async () => await serverTrpc.resource.artist.albums(artistId),
		[`resource:artist:getDiscography:${artistId}`],
		{ revalidate: 60 * 60 }
	)();
});

export const getCommunityReviews = cache((resource: Resource) => {
	return unstable_cache(
		async () => await serverTrpc.resource.rating.community({ resource }),
		[`resource:rating:getList:${resource.resourceId}`],
		{ revalidate: 60, tags: [resource.resourceId] }
	)();
});

export const getRating = cache((resource: Resource) => {
	return unstable_cache(
		async () => await serverTrpc.resource.rating.get(resource),
		[`resource:rating:get:${resource.resourceId}`],
		{ revalidate: 60 }
	)();
});

export const getUserRating = cache((resource: Resource) => {
	return unstable_cache(
		async () => await serverTrpc.user.rating.get(resource),
		[`user:rating:get:${resource.resourceId}`],
		{ revalidate: 60 }
	)();
});

export const getRatingsList = cache((resources: Resource[]) => {
	return unstable_cache(
		async () => await serverTrpc.resource.rating.getList(resources),
		[
			`resource:rating:getList:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getUserRatingList = cache((resources: Resource[]) => {
	return unstable_cache(
		async () => await serverTrpc.user.rating.getList(resources),
		[
			`user:rating:getList:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId), revalidate: 60 }
	)();
});

export const getNewReleases = cache(() => {
	return unstable_cache(
		async () => await serverTrpc.resource.album.newReleases(),
		[`resource:album:getNewReleases`],
		{ revalidate: 60 * 60 }
	)();
});
