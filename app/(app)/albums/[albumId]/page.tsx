import SongTable from "@/components/SongTable";
import { getAlbum } from "@/trpc/cached";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await getAlbum(albumId);

	return <SongTable songs={album.tracks?.items ?? []} />;
};

export default Page;
