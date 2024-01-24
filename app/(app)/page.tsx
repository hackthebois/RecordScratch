import { InfiniteReviews } from "@/components/resource/InfiniteReviews";
import AlbumList from "@/components/resource/album/AlbumList";
import { getFeed, getTopRated, getTrending } from "../_api";
import { spotify } from "../_api/spotify";

const Page = async () => {
	const newReleases = await spotify({
		route: "/browse/new-releases",
		input: undefined,
	});
	const trending = await getTrending();
	const top = await getTopRated();
	const initialFeed = await getFeed({
		page: 1,
		limit: 25,
	});

	return (
		<div className="w-full">
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">New Releases</h2>
				<AlbumList albums={newReleases.albums.items} />
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Trending</h2>
				<AlbumList albums={trending.albums} />
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Top Rated</h2>
				<AlbumList albums={top.albums} />
			</div>
			<h2 className="mb-2 mt-[2vh]">Feed</h2>
			<InfiniteReviews
				initialReviews={initialFeed}
				getReviews={getFeed}
				pageLimit={25}
			/>
		</div>
	);
};

export default Page;
