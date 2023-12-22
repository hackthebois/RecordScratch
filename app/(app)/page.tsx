import { Review } from "@/components/resource/Review";
import AlbumList from "@/components/resource/album/AlbumList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
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
	const feed = await getFeed();

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
				{feed.map(({ profile, ...review }, index) => (
					<Review
						key={index}
						review={review}
						profile={profile}
						resource={{
							category: review.category,
							resourceId: review.resourceId,
						}}
					/>
				))}
			</Tabs>
		</div>
	);
};

export default Page;
