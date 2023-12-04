import { serverTrpc } from "@/app/_trpc/server";
import AlbumList from "@/components/AlbumList";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const discography = await serverTrpc.resource.artist.albums(artistId);

	return <AlbumList albums={discography} type="wrap" field="date" />;
};

export default Page;
