import { getArtistDiscography } from "@/app/(app)/albums/_trpc/cached";
import AlbumList from "@/components/AlbumList";

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
