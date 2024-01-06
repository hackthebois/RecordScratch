import AlbumList from "@/components/resource/album/AlbumList";
import { Tabs } from "@/components/ui/Tabs";
import { unstable_noStore } from "next/cache";
import { InfiniteReviews } from "../../components/resource/InfiniteReviews";
import {
	getFeed,
	getNewReleases,
	getTopRated,
	getTrending,
} from "../_trpc/cached";

const Page = async () => {
	const newReleases = await getNewReleases();
	const trending = await getTrending();
	const top = await getTopRated();

	unstable_noStore();
	const feed = await getFeed({});

	return (
		<div className="w-full">
			<div className="mt-[2vh] flex flex-wrap justify-between">
				<h2 className="mb-2 mt-[2vh]">New Releases</h2>
				<AlbumList albums={newReleases} />
			</div>
			<div className="mt-[2vh] flex flex-wrap justify-between">
				<h2 className="mb-2 mt-[2vh]">Trending</h2>
				<AlbumList albums={trending} />
			</div>
			<div className="mt-[2vh] flex flex-wrap justify-between">
				<h2 className="mb-2 mt-[2vh]">Top</h2>
				<AlbumList albums={top} />
			</div>
			<h2 className="mb-2 mt-[2vh]">Feed</h2>
			<InfiniteReviews initialReviews={feed} getReviews={getFeed} />
		</div>
	);
};

export default Page;
