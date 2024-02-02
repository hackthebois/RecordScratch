import { Discord } from "@/components/icons/Discord";
import { InfiniteReviews } from "@/components/resource/InfiniteReviews";
import AlbumList from "@/components/resource/album/AlbumList";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env.mjs";
import Link from "next/link";
import { Suspense } from "react";
import { getFeed, getTopRated, getTrending } from "../_api";
import { spotify } from "../_api/spotify";

export const revalidate = 60 * 60 * 24; // 24 hours

const Feed = async () => {
	const initialFeed = await getFeed({
		page: 1,
		limit: 25,
	});

	return (
		<InfiniteReviews
			key="feed"
			initialReviews={initialFeed}
			getReviews={getFeed}
			pageLimit={25}
		/>
	);
};

export const fetchCache = "force-cache";

const Page = async () => {
	const newReleases = await spotify({
		route: "/browse/new-releases",
		input: undefined,
	});
	const trending = await getTrending();
	const top = await getTopRated();

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
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Trending</h2>
				<AlbumList albums={trending.albums} />
			</div>
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
