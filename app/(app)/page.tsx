import AlbumList from "@/components/resource/album/AlbumList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { unstable_noStore } from "next/cache";
import { getNewReleases, getTopRated, getTrending } from "../_trpc/cached";

const Page = async () => {
	unstable_noStore();
	const newReleases = await getNewReleases();
	const trending = await getTrending();
	const top = await getTopRated();

	return (
		<div className="w-full">
			<Tabs defaultValue="new">
				<div className="flex justify-between">
					<h2 className="mb-4">Albums</h2>
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
			</Tabs>
		</div>
	);
};

export default Page;
