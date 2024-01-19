import SongTable from "@/components/SongTable";
import { getArtistTopTracks } from "@/trpc/cached";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const topTracks = await getArtistTopTracks(artistId);

	return <SongTable songs={topTracks} />;
};

export default Page;
