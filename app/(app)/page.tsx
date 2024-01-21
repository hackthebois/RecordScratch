import { InfiniteReviews } from "@/components/resource/InfiniteReviews";
import AlbumList from "@/components/resource/album/AlbumList";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";
import {
	getFeed,
	getNewReleases,
	getTopRated,
	getTrending,
} from "../_api/cached";

const Feed = async () => {
	unstable_noStore();
	const initialFeed = await getFeed({
		page: 1,
		limit: 25,
	});

	return (
		<InfiniteReviews
			initialReviews={initialFeed}
			getReviews={getFeed}
			pageLimit={25}
		/>
	);
};

const Page = async () => {
	const newReleases = await getNewReleases();
	const trending = await getTrending();
	const top = await getTopRated();

	return (
		<div className="w-full">
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">New Releases</h2>
				<AlbumList albums={newReleases.albums.items} />
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Trending</h2>
				<AlbumList albums={trending} />
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Top Rated</h2>
				<AlbumList albums={top} />
			</div>
			<h2 className="mb-2 mt-[2vh]">Feed</h2>
			<Suspense fallback={null}>
				<Feed />
			</Suspense>
		</div>
	);
};

export default Page;
