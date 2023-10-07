import { env } from "@/env.mjs";
import { SpotifyAlbumSchema, SpotifyArtistSchema } from "types/spotify";
import { z } from "zod";
import { middleware, publicProcedure, router } from "./trpc";

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

const spotifyMiddleware = middleware(async ({ next, ctx }) => {
	const spotifyToken = await getSpotifyToken();

	return next({
		ctx: {
			spotifyToken,
			...ctx,
		},
	});
});

const spotifyProcedure = publicProcedure.use(spotifyMiddleware);

export const spotifyRouter = router({
	new: spotifyProcedure.query(async ({ ctx: { spotifyToken } }) => {
		const res = await fetch(
			"https://api.spotify.com/v1/browse/new-releases",
			{
				headers: {
					Authorization: `Bearer ${spotifyToken}`,
				},
				next: {
					revalidate: 3600,
				},
			}
		);
		const data = await res.json();
		return z
			.object({
				albums: z.object({ items: SpotifyAlbumSchema.array() }),
			})
			.parse(data).albums.items;
	}),
	search: spotifyProcedure
		.input(z.string().min(1))
		.query(async ({ ctx: { spotifyToken }, input: q }) => {
			const res = await fetch(
				`https://api.spotify.com/v1/search?q=${q}&type=album,artist&limit=4`,
				{
					headers: {
						Authorization: `Bearer ${spotifyToken}`,
					},
				}
			);
			const data = await res.json();
			return z
				.object({
					albums: SpotifyAlbumSchema.array(),
					artists: SpotifyArtistSchema.array(),
				})
				.parse({
					albums: data.albums.items,
					artists: data.artists.items,
				});
		}),
	album: spotifyProcedure
		.input(z.string())
		.query(async ({ ctx: { spotifyToken }, input: albumId }) => {
			const res = await fetch(
				`https://api.spotify.com/v1/albums/${albumId}`,
				{
					headers: {
						Authorization: `Bearer ${spotifyToken}`,
					},
					next: {
						revalidate: 3600,
					},
				}
			);
			const data = await res.json();
			return SpotifyAlbumSchema.parse(data);
		}),
	artist: spotifyProcedure
		.input(z.string())
		.query(async ({ ctx: { spotifyToken }, input: artistId }) => {
			const res = await fetch(
				`https://api.spotify.com/v1/artists/${artistId}`,
				{
					headers: {
						Authorization: `Bearer ${spotifyToken}`,
					},
					next: {
						revalidate: 3600,
					},
				}
			);
			const data = await res.json();
			return SpotifyArtistSchema.parse(data);
		}),
});
