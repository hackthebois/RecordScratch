"use server";

import { env } from "env.mjs";
import { SpotifyAlbumSchema, SpotifyArtistSchema } from "types/spotify";
import { z } from "zod";

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
		body: "grant_type=client_credentials",
		method: "POST",
	});
	const data = await res.json();
	return z.object({ access_token: z.string() }).parse(data).access_token;
};

export const getNewReleases = async () => {
	const token = await getSpotifyToken();
	const res = await fetch("https://api.spotify.com/v1/browse/new-releases", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			revalidate: 3600,
		},
	});
	const data = await res.json();
	console.log(data);
	return z
		.object({
			albums: z.object({ items: SpotifyAlbumSchema.array() }),
		})
		.parse(data).albums.items;
};

export const spotifySearch = async (q: string) => {
	const token = await getSpotifyToken();
	const res = await fetch(
		`https://api.spotify.com/v1/search?q=${q}&type=album,artist&limit=4`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	const data = await res.json();
	return z
		.object({
			albums: SpotifyAlbumSchema.array(),
			artists: SpotifyArtistSchema.array(),
		})
		.parse({ albums: data.albums.items, artists: data.artists.items });
};

export const getAlbum = async (albumId: string) => {
	const token = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			revalidate: 3600,
		},
	});
	const data = await res.json();
	return SpotifyAlbumSchema.parse(data);
};
