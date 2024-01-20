import SongTable from "@/app/_components/SongTable";
import { getArtistTopTracks } from "@/app/_trpc/cached";

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
