"use client";

import { useDeezer } from "@/app/_api/deezer";
import SongTable from "@/components/SongTable";

const Page = ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const { data: top } = useDeezer({
		route: "/artist/{id}/top",
		input: {
			id: artistId,
		},
	});

	return <SongTable songs={top.data} />;
};

export default Page;
