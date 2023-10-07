import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import {
	SpotifyAlbumSchema,
	SpotifyArtistSchema,
	SpotifyTrackSchema,
} from "types/spotify";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

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
		cache: "no-store",
		body: "grant_type=client_credentials",
		method: "POST",
	});
	const data = await res.json();
	return z.object({ access_token: z.string() }).parse(data).access_token;
};

const spotifyFetch = async (url: string) => {
	const spotifyToken = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1${url}`, {
		headers: {
			Authorization: `Bearer ${spotifyToken}`,
		},
	});

	if (!res.ok) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Spotify API Error",
		});
	}

	const data: unknown = await res.json();
	return { data, res };
};

export const spotifyRouter = router({
	new: publicProcedure.query(async () => {
		const { data } = await spotifyFetch("/browse/new-releases");
		return z
			.object({
				albums: z.object({ items: SpotifyAlbumSchema.array() }),
			})
			.parse(data).albums.items;
	}),
	search: publicProcedure
		.input(z.string().min(1))
		.query(async ({ input: q }) => {
			const { data } = await spotifyFetch(
				`/search?q=${q}&type=album,artist&limit=4`
			);
			return z
				.object({
					albums: z.object({ items: SpotifyAlbumSchema.array() }),
					artists: z.object({
						items: SpotifyArtistSchema.array(),
					}),
				})
				.parse(data);
		}),
	album: publicProcedure
		.input(z.string())
		.query(async ({ input: albumId }) => {
			const { data } = await spotifyFetch(`/albums/${albumId}`);
			return SpotifyAlbumSchema.parse(data);
		}),
	artist: router({
		findOne: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId }) => {
				const { data } = await spotifyFetch(`/artists/${artistId}`);
				console.log(data);
				return SpotifyArtistSchema.parse(data);
			}),
		albums: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId }) => {
				const { data } = await spotifyFetch(
					`/artists/${artistId}/albums`
				);
				return z
					.object({
						items: SpotifyAlbumSchema.array(),
					})
					.parse(data).items;
			}),
		topTracks: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId }) => {
				const { data } = await spotifyFetch(
					`/artists/${artistId}/top-tracks?market=US`
				);
				return z
					.object({
						tracks: SpotifyTrackSchema.array(),
					})
					.parse(data).tracks;
			}),
	}),
});
