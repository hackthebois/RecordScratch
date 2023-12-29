import AlbumList from "@/components/resource/album/AlbumList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { unstable_noStore } from "next/cache";
import {
	getFeed,
	getNewReleases,
	getTopRated,
	getTrending,
} from "../_trpc/cached";
import Feed from "./Feed";

const Page = async () => {
	const newReleases = await getNewReleases();
	const trending = await getTrending();
	const top = await getTopRated();

	unstable_noStore();
	const feed = await getFeed({});

	return (
		<div className="w-full">
			<Tabs defaultValue="new">
				<div className="mt-[2vh] flex flex-wrap justify-between">
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
				</TabsContent>
				<h2 className="mb-2 mt-[2vh]">Feed</h2>
				<Feed initialReviews={feed} />
			</Tabs>
		</div>
	);
};

export default Page;
