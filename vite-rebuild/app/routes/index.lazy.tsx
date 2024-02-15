import { Discord } from "@/components/icons/Discord";
import AlbumList from "@/components/resource/album/AlbumList";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { api } from "app/trpc/react";

const Index = () => {
	const { data: trending } = api.ratings.trending.useQuery();
	const { data: top } = api.ratings.top.useQuery();

	return (
		<div className="w-full">
			<div className="flex gap-4">
				<Link
					href={env.VITE_DISCORD_URL}
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
			{trending && (
				<div className="mt-[2vh] flex flex-col">
					<h2 className="mb-4">Trending</h2>
					<AlbumList albums={trending.map(({ resourceId }) => resourceId)} />
				</div>
			)}
			{top && (
				<div className="mt-[2vh] flex flex-col">
					<h2 className="mb-4">Top Rated</h2>
					<AlbumList albums={top.map(({ resourceId }) => resourceId)} />
				</div>
			)}
			<h2 className="mb-2 mt-[2vh]">Feed</h2>
			{/* <Suspense>
				<Feed />
			</Suspense> */}
		</div>
	);
};

export const Route = createLazyFileRoute("/")({
	component: Index,
});
