import SongTable from "@/app/_auth/SongTable";
import { getArtistTopTracks } from "@/app/_trpc/cached";
import { Suspense } from "react";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const topTracks = await getArtistTopTracks(artistId);

	return (
		<Suspense>
			<SongTable songs={topTracks.tracks} />
		</Suspense>
	);
};

export default Page;
