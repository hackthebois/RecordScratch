import AlbumList from "@/components/albums/AlbumList";
import { serverTrpc } from "./_trpc/server";

const Page = async () => {
	const newReleases = await serverTrpc.spotify.new();

	return (
		<div className="w-full">
			<h2 className="p-4">New Releases</h2>
			<AlbumList albums={newReleases} />
		</div>
	);
};

export default Page;
