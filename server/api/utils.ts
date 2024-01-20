import { Profile } from "@/types/profile";
import { Rating, Resource, Review } from "@/types/rating";
import { Album, SimplifiedAlbum, SpotifyApi } from "@spotify/web-api-ts-sdk";

export const appendReviewResource = async (
	ratingList: (Rating & { profile: Profile })[],
	spotify: SpotifyApi
): Promise<Review[]> => {
	if (ratingList.length === 0) return [];

	let resourceExtras: (Resource & {
		album: Album | SimplifiedAlbum;
		name: string;
	})[] = [];

	const albums = ratingList.filter((r) => r.category === "ALBUM");
	const songs = ratingList.filter((r) => r.category === "SONG");

	if (albums.length !== 0) {
		const albumData = await spotify.albums.get(
			albums.map((a) => a.resourceId)
		);
		resourceExtras.push(
			...albumData.map((album) => ({
				resourceId: album.id,
				category: "ALBUM" as Resource["category"],
				album,
				name: album.name,
			}))
		);
	}
	if (songs.length !== 0) {
		const songData = await spotify.tracks.get(
			songs.map((a) => a.resourceId)
		);
		resourceExtras.push(
			...songData.map((a) => ({
				resourceId: a.id,
				category: "SONG" as Resource["category"],
				album: a.album,
				name: a.name,
			}))
		);
	}

	return ratingList
		.filter(({ profile }) => profile !== null)
		.map(({ profile, ...rating }) => {
			const resource = resourceExtras.find(
				(r) =>
					r.resourceId === rating.resourceId &&
					r.category === rating.category
			);
			return {
				rating,
				profile,
				album: resource!.album,
				name: resource!.name,
			};
		});
};
