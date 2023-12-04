import { serverTrpc } from "@/app/_trpc/server";
import SongTable from "@/components/SongTable";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await serverTrpc.resource.album.get(albumId);

	return <SongTable songs={album.tracks?.items ?? []} />;
};

export default Page;
