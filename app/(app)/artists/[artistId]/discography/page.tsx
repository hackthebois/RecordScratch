"use client";

import { useDeezer } from "@/app/_api/deezer";
import AlbumList from "@/components/resource/album/AlbumList";

const Page = ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const { data: discography } = useDeezer({
		route: `/artist/{id}/albums`,
		input: {
			id: artistId,
		},
	});

	return <AlbumList albums={discography.data} type="wrap" field="date" />;
};

export default Page;
