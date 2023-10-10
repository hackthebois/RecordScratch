import AlbumList from "@/components/album/AlbumList";
import { unstable_cache } from "next/cache";
import { serverTrpc } from "./_trpc/server";

const Page = async () => {
	const newReleases = await unstable_cache(
		async () => await serverTrpc.spotify.new.query(),
		["new_releases"],
		{
			revalidate: 60 * 60,
		}
	)();

	return (
		<div className="w-full">
			<h2 className="pb-6">New Releases</h2>

			<AlbumList albums={newReleases} />
		</div>
	);
};

export default Page;
