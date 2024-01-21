import SongTable from "@/app/_auth/SongTable";
import { getAlbum } from "@/app/_trpc/cached";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await getAlbum(albumId);

	return <SongTable songs={album.tracks.items} />;
};

export default Page;
