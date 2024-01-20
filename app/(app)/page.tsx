import AlbumList from "@/components/resource/album/AlbumList";
import {
	GetInfiniteReviews,
	InfiniteReviews,
} from "../../components/resource/InfiniteReviews";
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

	const getReviews = async (input: GetInfiniteReviews) => {
		"use server";
		return await getFeed(input);
	};

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
			<InfiniteReviews
				initialReviews={await getReviews({ page: 1, limit: 25 })}
				getReviews={getReviews}
				pageLimit={25}
			/>
		</div>
	);
};

export default Page;
