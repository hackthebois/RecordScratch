import { Discord } from "@/components/icons/Discord";
import AlbumList from "@/components/resource/album/AlbumList";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env";
import { api, apiUtils } from "@/trpc/react";
import { Link, createFileRoute } from "@tanstack/react-router";

const Index = () => {
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();

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

export const Route = createFileRoute("/")({
	loader: async () => {
		return {
			top: apiUtils.ratings.top.ensureData(),
			trending: apiUtils.ratings.trending.ensureData(),
		};
	},
	component: Index,
	pendingComponent: () => <div>Loading...</div>,
});
