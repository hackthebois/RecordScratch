import SongTable from "@/app/_auth/SongTable";
import { getArtistTopTracks } from "@/app/_trpc/cached";

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
