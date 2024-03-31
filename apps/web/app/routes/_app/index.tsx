import { Head } from "@/components/Head";
import Metadata from "@/components/Metadata";
import AlbumList from "@/components/album/AlbumList";
import {
	FollowingFeedReviews,
	RecentFeedReviews,
} from "@/components/infinite/InfiniteFeedReviews";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { buttonVariants } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api, apiUtils } from "@/trpc/react";
import { formatDuration } from "@recordscratch/utils/date";
import { getQueryOptions } from "@recordscratch/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_app/")({
	component: Index,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				feed: z.enum(["following"]).optional(),
			})
			.parse(search);
	},
	loader: async () => {
		apiUtils.ratings.top.ensureData();
		apiUtils.ratings.trending.ensureData();
	},
});

const AlbumOfTheDay = () => {
	const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumOfTheDay.albumId },
		})
	);

	return (
		<Metadata
			title={album.title}
			cover={album.cover_big ?? ""}
			tags={[
				album.release_date,
				album.duration
					? `${formatDuration(album.duration)}`
					: undefined,
				...(album.genres?.data.map((genre) => genre.name) ?? []),
			]}
			type="ALBUM OF THE DAY"
		>
			<Link
				to="/artists/$artistId"
				params={{
					artistId: String(album.artist?.id),
				}}
				className="text-muted-foreground hover:underline"
			>
				{album.artist?.name}
			</Link>
			<Link
				to="/albums/$albumId"
				params={{
					albumId: String(album.id),
				}}
				className={buttonVariants({
					variant: "outline",
				})}
			>
				Go to album
			</Link>
		</Metadata>
	);
};

function Index() {
	const { feed = "recent" } = Route.useSearch();
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();
	const { data: profile } = api.profiles.me.useQuery();

	return (
		<div className="flex flex-col gap-8">
			<Head
				title="Home"
				description="View album of the day, trending albums, top rated albums and recent reviews."
			/>
			<AlbumOfTheDay />
			{trending && (
				<>
					<h2>Trending</h2>
					<AlbumList
						albums={trending.map(({ resourceId }) => resourceId)}
					/>
				</>
			)}
			{top && (
				<>
					<h2>Top Rated</h2>
					<AlbumList
						albums={top.map(({ resourceId }) => resourceId)}
					/>
				</>
			)}
			<h2 className="-mb-6">Feed</h2>
			{profile && (
				<Tabs value={feed} className="w-full">
					<TabsList>
						<TabsTrigger value="recent" asChild>
							<Link
								to={Route.fullPath}
								search={{
									feed: undefined,
								}}
							>
								Recent
							</Link>
						</TabsTrigger>
						<TabsTrigger value="following" asChild>
							<Link
								to={Route.fullPath}
								search={{
									feed: "following",
								}}
							>
								Following
							</Link>
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
			{!profile && <RecentFeedReviews input={{ limit: 20 }} />}
		</div>
	);
}
