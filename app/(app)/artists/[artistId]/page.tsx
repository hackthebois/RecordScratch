import { getArtistTopTracks } from "@/app/_api";
import SongTable from "@/app/_auth/SongTable";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const topTracks = await getArtistTopTracks(artistId);

	return <SongTable songs={topTracks.tracks} />;
};

export default Page;
