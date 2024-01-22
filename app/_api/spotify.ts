import { env } from "@/env.mjs";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const spotify = SpotifyApi.withClientCredentials(
	env.SPOTIFY_CLIENT,
	env.SPOTIFY_SECRET
);
