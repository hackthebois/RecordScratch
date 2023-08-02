import { NextResponse } from "next/server";
import { getSpotifyToken } from "../../actions";

export const GET = async (req: Request) => {
	const token = await getSpotifyToken();
	const { searchParams } = new URL(req.url);
	console.log(searchParams.toString());

	const res = await fetch(`https://api.spotify.com/v1/search?${searchParams.toString()}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	return NextResponse.json(data);
};
