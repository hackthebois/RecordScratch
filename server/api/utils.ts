import { env } from "@/env.mjs";
import { Profile } from "@/types/profile";
import { Rating, Resource, Review } from "@/types/rating";
import { TRPCError } from "@trpc/server";
import {
	SpotifyAlbum,
	SpotifyAlbumSchema,
	SpotifyTrackSchema,
} from "types/spotify";
import { z } from "zod";
import { logServerEvent } from "../posthog";

export const getSpotifyToken = async () => {
	const res = await fetch("https://accounts.spotify.com/api/token", {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(
					env.SPOTIFY_CLIENT + ":" + env.SPOTIFY_SECRET
				).toString("base64"),
		},
		next: {
			revalidate: 60 * 59,
		},
		body: "grant_type=client_credentials",
		method: "POST",
	});
	const data = await res.json();
	return z.object({ access_token: z.string() }).parse(data).access_token;
};

export const appendReviewResource = async (
	ratingList: (Rating & { profile: Profile })[],
	userId: string | null
): Promise<Review[]> => {
	if (ratingList.length === 0) return [];

	let resourceExtras: (Resource & {
		album: SpotifyAlbum;
		name: string;
	})[] = [];

	const albums = ratingList.filter((r) => r.category === "ALBUM");
	const songs = ratingList.filter((r) => r.category === "SONG");

	if (albums.length !== 0) {
		const { data: albumData } = await spotifyFetch({
			url: "/albums/?ids=" + albums.map((a) => a.resourceId).join(","),
			userId,
		});
		const parsedAlbums = z
			.object({
				albums: SpotifyAlbumSchema.array(),
			})
			.parse(albumData).albums;
		resourceExtras.push(
			...parsedAlbums.map((album) => ({
				resourceId: album.id,
				category: "ALBUM" as Resource["category"],
				album,
				name: album.name,
			}))
		);
	}
	if (songs.length !== 0) {
		const { data: songData } = await spotifyFetch({
			url: "/tracks/?ids=" + songs.map((a) => a.resourceId).join(","),
			userId,
		});
		const parsedSongs = z
			.object({
				tracks: SpotifyTrackSchema.extend({
					album: SpotifyAlbumSchema,
				}).array(),
			})
			.parse(songData).tracks;
		resourceExtras.push(
			...parsedSongs.map((a) => ({
				resourceId: a.id,
				category: "SONG" as Resource["category"],
				album: a.album,
				name: a.name,
			}))
		);
	}

	return ratingList
		.filter(({ profile }) => profile !== null)
		.map(({ profile, ...rating }) => {
			const resource = resourceExtras.find(
				(r) =>
					r.resourceId === rating.resourceId &&
					r.category === rating.category
			);
			return {
				rating,
				profile,
				album: resource!.album,
				name: resource!.name,
			};
		});
};

export const spotifyFetch = async ({
	url,
	userId,
}: {
	url: string;
	userId: string | null;
}) => {
	const spotifyToken = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1${url}`, {
		headers: {
			Authorization: `Bearer ${spotifyToken}`,
		},
	});

	await logServerEvent("spotify request", {
		distinctId: userId ?? "public",
		properties: {
			endpoint: url,
		},
	});

	if (!res.ok) {
		console.error(await res.text());
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message:
				"Spotify API error: " +
				res.statusText +
				" (" +
				res.status +
				")",
		});
	}

	const data: unknown = await res.json();
	return { data, res };
};
