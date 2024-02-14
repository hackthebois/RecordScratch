"use client";

import { deezer } from "@/app/_api/deezer";
import SongTable from "@/components/SongTable";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const { data: album } = useSuspenseQuery({
		queryKey: ["album", albumId],
		queryFn: () =>
			deezer({
				route: `/album/{id}`,
				input: {
					id: albumId,
				},
			}),
	});

	return <SongTable songs={album.tracks?.data ?? []} />;
};

export default Page;
