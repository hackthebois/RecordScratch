"use client";

import { deezer } from "@/app/_api/deezer";
import SongTable from "@/components/SongTable";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const { data: top } = useSuspenseQuery({
		queryKey: ["artist", "top-tracks", artistId],
		queryFn: () =>
			deezer({ route: `/artist/{id}/top`, input: { id: artistId } }),
	});

	return <SongTable songs={top.data} />;
};

export default Page;
