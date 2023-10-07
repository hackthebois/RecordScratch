import AlbumList from "@/components/albums/AlbumList";
import { serverTrpc } from "./_trpc/server";

const Page = async () => {
	const newReleases = await serverTrpc.spotify.new();

	return (
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col overflow-hidden px-4 py-8 sm:px-8">
			<h2 className="mb-6">New Releases</h2>
			<AlbumList albums={newReleases} />
		</main>
	);
};

export default Page;
