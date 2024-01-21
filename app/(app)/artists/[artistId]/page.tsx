import { getArtistTopTracks } from "@/app/_api/cached";
import SongTable from "@/app/_auth/SongTable";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const topTracks = await getArtistTopTracks(artistId);

	return (
		<SongTable
			songs={topTracks.tracks}
			resource={{
				category: "ARTIST",
				resourceId: artistId,
			}}
		/>
	);
};

export default Page;
