import { InfiniteReviews } from "@/components/resource/InfiniteReviews";
import AlbumList from "@/components/resource/album/AlbumList";
import { buttonVariants } from "@/components/ui/Button";
import { Github } from "lucide-react";
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
			<div className="flex w-full items-center justify-between rounded-md border px-4 py-1 sm:p-4">
				<div>
					<p className="font-medium">Join our community!</p>
					<p className="hidden text-sm text-muted-foreground sm:block">
						We would love to hear your thoughts and feedback
					</p>
				</div>
				<div className="flex items-center gap-2 sm:gap-4">
					<Link
						href="https://discord.gg/NBS4brPe"
						className={buttonVariants({
							variant: "ghost",
							className:
								"h-10 w-10 gap-2 border-input px-0 py-0 sm:w-auto sm:border sm:px-4 sm:py-2",
						})}
					>
						<svg
							width={25}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 127.14 96.36"
						>
							<path
								className="fill-current"
								d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
							/>
						</svg>
						<p className="hidden sm:block">Discord</p>
					</Link>
					<Link
						href="https://github.com/hackthebois/RecordScratch"
						className={buttonVariants({
							variant: "ghost",
							className:
								"-mr-2 h-10 w-10 gap-2 border-input px-0 py-0 sm:mr-0 sm:w-auto sm:border sm:px-4 sm:py-2",
						})}
					>
						<Github size={25} />
						<p className="hidden sm:block">Github</p>
					</Link>
				</div>
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
