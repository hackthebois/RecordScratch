import AlbumList from "@/components/AlbumList";
import { serverTrpc } from "./_trpc/server";

const Page = async () => {
	const newReleases = await serverTrpc.resource.new();

	return (
		<div className="w-full">
			<h2 className="pb-6">New Releases</h2>
			<AlbumList albums={newReleases} />
		</div>
	);
};

export default Page;
