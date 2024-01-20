import { getArtistTopTracks } from "@/app/_trpc/cached";
import SongTable from "@/components/SongTable";

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
