import { getAlbum } from "@/app/_api";
import SongTable from "@/app/_auth/SongTable";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await getAlbum(albumId);

	return (
		<SongTable
			songs={album.tracks.items}
			resource={{
				category: "ALBUM",
				resourceId: albumId,
			}}
		/>
	);
};

export default Page;
