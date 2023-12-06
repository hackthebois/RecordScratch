import AlbumList from "@/components/AlbumList";
import { getNewReleases } from "./_trpc/cached";

const Page = async () => {
	const newReleases = await getNewReleases();

	return (
		<div className="w-full">
			<h2 className="pb-6">New Releases</h2>
			<AlbumList albums={newReleases} />
		</div>
	);
};

export default Page;
