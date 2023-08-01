import { NextResponse } from "next/server";
import { z } from "zod";
import { getSpotifyToken } from "../lib/spotify";

export const GET = async (req: Request) => {
	const token = await getSpotifyToken();
	const { searchParams } = new URL(req.url);

	const params = z
		.object({
			q: z.string(),
			type: z
				.enum(["album", "artist", "playlist", "track", "show", "episode", "audiobook"])
				.array(),
		})
		.parse({ q: searchParams.get("q"), type: searchParams.get("type").split(",") });

	const res = await fetch(`https://api.spotify.com/v1/search?q=${params.q}&type=${params.type}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();

	return NextResponse.json(data);
};
