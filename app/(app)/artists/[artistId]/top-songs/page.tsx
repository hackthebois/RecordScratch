import { getArtistTopTracks } from "@/app/(app)/albums/_trpc/cached";
import SongTable from "@/components/SongTable";

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
