import SongTable from "@/app/_auth/SongTable";
import { getAlbum } from "@/app/_trpc/cached";
import { Suspense } from "react";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await getAlbum(albumId);

	return (
		<Suspense>
			<SongTable songs={album.tracks.items} />
		</Suspense>
	);
};

export default Page;
