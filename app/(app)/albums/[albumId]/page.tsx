"use client";

import { useDeezer } from "@/app/_api/deezer";
import SongTable from "@/components/SongTable";

const Page = ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const { data: album } = useDeezer({
		route: `/album/{id}`,
		input: {
			id: albumId,
		},
	});

	return <SongTable songs={album.tracks?.data ?? []} />;
};

export default Page;
