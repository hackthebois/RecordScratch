import { Discord } from "@/components/icons/Discord";
import { InfiniteReviews } from "@/components/resource/InfiniteReviews";
import AlbumList from "@/components/resource/album/AlbumList";
import { buttonVariants } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { env } from "@/env.mjs";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import {
	getFollowingFeed,
	getRecentFeed,
	getTopRated,
	getTrending,
} from "../_api";
import { spotify } from "../_api/spotify";

export const revalidate = 60 * 60 * 24; // 24 hours

const RecentFeed = async () => {
	return (
		<InfiniteReviews
			id="recent-feed"
			initialReviews={await getRecentFeed({
				page: 1,
				limit: 20,
			})}
			getReviews={getRecentFeed}
			pageLimit={20}
		/>
	);
};

const Feed = async () => {
	const { userId } = auth();

	if (!userId) {
		return <RecentFeed />;
	}

	return (
		<Tabs defaultValue="recent" className="w-full">
			<TabsList>
				<TabsTrigger value="recent">Recent</TabsTrigger>
				<TabsTrigger value="following">Following</TabsTrigger>
			</TabsList>
			<TabsContent value="recent">
				<RecentFeed />
			</TabsContent>
			<TabsContent value="following" className="w-full">
				<InfiniteReviews
					id="following-feed"
					initialReviews={await getFollowingFeed({
						page: 1,
						limit: 20,
					})}
					getReviews={getFollowingFeed}
					pageLimit={20}
				/>
			</TabsContent>
		</Tabs>
	);
};

export const fetchCache = "force-cache";

const Page = async () => {
	const [newReleases, trending, top] = await Promise.all([
		spotify({
			route: "/browse/new-releases",
			input: undefined,
		}),
		getTrending(),
		getTopRated(),
	]);

	return (
		<div className="w-full">
			<div className="flex gap-4">
				<Link
					href={env.NEXT_PUBLIC_DISCORD_URL}
					className={buttonVariants({
						variant: "outline",
						className: "gap-3",
					})}
					target="_blank"
				>
					<Discord size={22} />
					<p>Join our discord</p>
				</Link>
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">New Releases</h2>
				<AlbumList albums={newReleases.albums.items} />
			</div>
			{trending.albums.length > 0 && (
				<div className="mt-[2vh] flex flex-col">
					<h2 className="mb-4">Trending</h2>
					<AlbumList albums={trending.albums} />
				</div>
			)}
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Top Rated</h2>
				<AlbumList albums={top.albums} />
			</div>
			<h2 className="mb-2 mt-[2vh]">Feed</h2>
			<Suspense>
				<Feed />
			</Suspense>
		</div>
	);
};

export default Page;
