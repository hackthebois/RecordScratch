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
			<Tabs defaultValue="new">
				{/* <div className="mt-[2vh] flex flex-wrap justify-between">
					<h2 className="mb-4">This Week</h2>
					<TabsList className="mb-2">
						<TabsTrigger value="new">New</TabsTrigger>
						<TabsTrigger value="trending">Trending</TabsTrigger>
						<TabsTrigger value="top">Top Rated</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="new">
					<AlbumList albums={newReleases} />
				</TabsContent>
				<TabsContent value="trending">
					<AlbumList albums={trending} />
				</TabsContent>
				<TabsContent value="top">
					<AlbumList albums={top} />
				</TabsContent> */}
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
			</Tabs>
		</div>
	);
};

export default Page;
