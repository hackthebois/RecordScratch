"use client";

import { deezer } from "@/app/_api/deezer";
import AlbumList from "@/components/resource/album/AlbumList";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const { data: discography } = useSuspenseQuery({
		queryKey: ["artist", "discography", artistId],
		queryFn: () =>
			deezer({
				route: `/artist/{id}/albums`,
				input: { id: artistId, limit: 1000 },
			}),
	});

	return <AlbumList albums={discography.data} type="wrap" field="date" />;
};

export default Page;
