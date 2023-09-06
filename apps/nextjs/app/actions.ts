"use server";

import { z } from "zod";
import { env } from "../env.mjs";

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
		cache: "no-store",
		next: {
			revalidate: 3600,
		},
	});
	const data = await res.json();
	console.log(data);
	return z.object({ access_token: z.string() }).parse(data).access_token;
};
