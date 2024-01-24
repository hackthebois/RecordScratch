import { Profile } from "@/types/profile";
import { Rating, Resource, Review } from "@/types/rating";
import { Album, spotify } from "./spotify";

export const appendReviewResource = async (
	ratingList: (Rating & { profile: Profile })[]
): Promise<Review[]> => {
	if (ratingList.length === 0) return [];

	let resourceExtras: (Resource & {
		album: Album;
		name: string;
	})[] = [];

	const albums = ratingList.filter((r) => r.category === "ALBUM");
	const songs = ratingList.filter((r) => r.category === "SONG");

	if (albums.length !== 0) {
		const albumData = await spotify({
			route: "/albums",
			input: { ids: albums.map((a) => a.resourceId) },
		});
		resourceExtras.push(
			...albumData.albums.map((album) => ({
				resourceId: album.id,
				category: "ALBUM" as Resource["category"],
				album,
				name: album.name,
			}))
		);
	}
	if (songs.length !== 0) {
		const songData = await spotify({
			route: "/tracks",
			input: { ids: songs.map((a) => a.resourceId) },
		});
		resourceExtras.push(
			...songData.tracks.map((a) => ({
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
