import { serverTrpc } from "@/app/_trpc/server";
import SongTable from "@/components/SongTable";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const topTracks = await serverTrpc.resource.artist.topTracks(artistId);

	return <SongTable songs={topTracks} />;
};

export default Page;
