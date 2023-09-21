import { serverTrpc } from "@/app/_trpc/server";

export const GET = async () => {
	//const album = await serverTrpc.spotify.album("albumId");
	const rating = await serverTrpc.album.getAlbumAverage({ albumId: "1" });

	// const songRatings = await serverTrpc.song.getAllAverageSongRatings({
	// 	albumId: "1",
	// });

	console.log(rating);
};
