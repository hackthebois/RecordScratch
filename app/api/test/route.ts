import { serverTrpc } from "@/app/_trpc/server";
import { NextResponse } from "next/server";

export const GET = async () => {
	//const album = await serverTrpc.spotify.album("albumId");
	const rating = await serverTrpc.album.getAlbumAverage({
		// albumId: "0ETFjACtuP2ADo6LFhL6HN",
		albumId: "1",
	});

	// const songRatings = await serverTrpc.song.getAllAverageSongRatings({
	// 	albumId: "1",
	// });

	return NextResponse.json({ rating });
};
