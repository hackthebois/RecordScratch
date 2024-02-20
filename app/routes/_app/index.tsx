import { FollowingFeedReviews, RecentFeedReviews } from "@/components/InfiniteFeedReviews";
import { Pending } from "@/components/Pending";
import AlbumList from "@/components/album/AlbumList";
import { Discord } from "@/components/icons/Discord";
import { buttonVariants } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { env } from "@/env";
import { api, apiUtils } from "@/trpc/react";
import { useAuth } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_app/")({
	component: Index,
	pendingComponent: Pending,
	validateSearch: (search) => {
		return z
			.object({
				feed: z.enum(["following"]).optional(),
			})
			.parse(search);
	},
	loader: async () => {
		return {
			top: apiUtils.ratings.top.ensureData(),
			trending: apiUtils.ratings.trending.ensureData(),
		};
	},
});

function Index() {
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { feed = "recent" } = Route.useSearch();
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();
	const { userId, isLoaded } = useAuth();

	return (
		<div className="w-full">
			<div className="flex gap-4">
				<a
					href={env.VITE_DISCORD_URL}
					className={buttonVariants({
						variant: "outline",
						className: "gap-3",
					})}
					target="_blank"
				>
					<Discord size={22} />
					<p>Join our discord</p>
				</a>
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
			{isLoaded && (
				<>
					{userId && (
						<Tabs value={feed} className="w-full">
							<TabsList>
								<TabsTrigger
									value="recent"
									onClick={() => {
										navigate({
											search: {
												feed: undefined,
											},
										});
									}}
								>
									Recent
								</TabsTrigger>
								<TabsTrigger
									value="following"
									onClick={() => {
										navigate({
											search: {
												feed: "following",
											},
										});
									}}
								>
									Following
								</TabsTrigger>
							</TabsList>
							<TabsContent value="recent">
								<RecentFeedReviews input={{ limit: 20 }} />
							</TabsContent>
							<TabsContent value="following">
								<FollowingFeedReviews input={{ limit: 20 }} />
							</TabsContent>
						</Tabs>
					)}
					{!userId && <RecentFeedReviews input={{ limit: 20 }} />}
				</>
			)}
		</div>
	);
}
