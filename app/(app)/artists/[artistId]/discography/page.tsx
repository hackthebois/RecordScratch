import { getArtistDiscography } from "@/app/_api";
import AlbumList from "@/components/resource/album/AlbumList";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	const discography = await getArtistDiscography(artistId);

	return <AlbumList albums={discography} type="wrap" field="date" />;
};

export default Page;
