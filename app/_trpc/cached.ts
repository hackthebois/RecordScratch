"use server";
import "server-only";

import { api, publicApi } from "@/app/_trpc/server";
import { GetInfiniteReviews } from "@/components/resource/InfiniteReviews";
import { RouterInputs } from "@/server/api";
import { Resource } from "@/types/rating";
import { cache } from "react";

// PUBLIC
const spotifyRevalidate = 60 * 60 * 24; // 24 hours

export const getAlbum = cache((albumId: string) => {
	return publicApi.resource.album.get.query(albumId);
});

export const getArtist = cache((artistId: string) => {
	return publicApi.resource.artist.get.query(artistId);
});

export const getArtistTopTracks = cache((artistId: string) => {
	return publicApi.resource.artist.topTracks.query(artistId);
});

export const getNewReleases = cache(() => {
	return publicApi.resource.album.newReleases.query();
});

export const getSong = cache((songId: string) => {
	return publicApi.resource.song.get.query(songId);
});

export const getArtistDiscography = cache((artistId: string) => {
	return publicApi.resource.artist.albums.query(artistId);
});

export const getTrending = cache(() => {
	return publicApi.resource.album.trending.query();
});

export const getTopRated = cache(() => {
	return publicApi.resource.album.top.query();
});

export const getFeed = (input: GetInfiniteReviews) => {
	return publicApi.resource.rating.feed.query(input);
};

export const getCommunityReviews = cache(
	(input: RouterInputs["resource"]["rating"]["community"]) => {
		return publicApi.resource.rating.community.query(input);
	}
);

export const getRatingListAverage = cache((resources: Resource[]) => {
	return publicApi.resource.rating.getListAverage.query(resources);
});

export const getProfile = cache((handle: string) => {
	return publicApi.user.profile.get.query({ handle });
});

export const getMyProfile = cache(() => {
	return api.user.profile.me.query();
});

export const getRecent = cache((input: RouterInputs["user"]["recent"]) => {
	return publicApi.user.recent.query(input);
});

export const getDistribution = cache((userId: string) => {
	return publicApi.user.profile.distribution.query(userId);
});

export const getRating = cache((resource: Resource) => {
	return publicApi.resource.rating.get.query(resource);
});

export const getRatingsList = cache((resources: Resource[]) => {
	return publicApi.resource.rating.getList.query(resources);
});

// APP

export const getUserRating = cache((resource: Resource) => {
	return api.user.rating.get.query(resource);
});

export const getUserRatingList = cache((resources: Resource[]) => {
	return api.user.rating.getList.query(resources);
});
