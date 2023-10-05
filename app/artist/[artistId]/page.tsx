import { serverTrpc } from "@/app/_trpc/server";

type Props = {
	params: {
		artistId: string;
	};
};

const Artist = async ({ params: { artistId } }: Props) => {
	const artist = await serverTrpc.spotify.artist(artistId);
	console.log(artist);

	return <div>page</div>;
};

export default Artist;
