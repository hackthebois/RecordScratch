import { serverTrpc } from "@/app/_trpc/server";
import { NextResponse } from "next/server";

export const GET = async () => {
	//const album = await serverTrpc.spotify.album("albumId");
	// const rating = await serverTrpc.album.getAlbumAverage({
	// 	// albumId: "0ETFjACtuP2ADo6LFhL6HN",
	// 	albumId: "2",
	// });

	// const songRatings = await serverTrpc.song.getAllAverageSongRatings({
	// 	albumId: "1",
	// });

	// const newRating = await serverTrpc.album.rateAlbum({
	// 	albumId: "1",
	// 	rating: 5,
	// 	description: "",
	// });

	// const newSongRating = await serverTrpc.song.rateSong({
	// 	albumId: "1",
	// 	songId: "1",
	// 	rating: 8,
	// });

	const artistRating = await serverTrpc.album.getEveryAlbumAverage({
		id: "2",
		albums: [
			"0ETFjACtuP2ADo6LFhL6HN",
			"0jTGHV5xqHPvEcwL8f6YU5",
			"0lzhEDgoe7Y6bhT42NWrp2",
			"1klALx0u4AavZNEvC4LrTL",
			"20r762YmB5HeofjMCiPMLv",
			"49LA20VMk65fQyEaIzYdvf",
			"2nkto6YNI4rUYTLqEwWJ3o",
		],
	});

	return NextResponse.json({ artistRating });
};
