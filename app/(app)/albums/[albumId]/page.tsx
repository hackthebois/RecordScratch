import { getAlbum } from "@/app/trpc/cached";
import SongTable from "@/components/SongTable";

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
