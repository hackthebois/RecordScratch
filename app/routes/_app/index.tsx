import {
	FollowingFeedReviews,
	RecentFeedReviews,
} from "@/components/InfiniteFeedReviews";
import Metadata from "@/components/Metadata";
import AlbumList from "@/components/album/AlbumList";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { buttonVariants } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api, apiUtils } from "@/trpc/react";
import { formatMs } from "@/utils/date";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
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

const albums = [
	{
		albumId: "44730061",
		date: new Date(2024, 1, 23),
	},
	{
		albumId: "542677642",
		date: new Date(2024, 1, 24),
	},
	{
		albumId: "117320",
		date: new Date(2024, 1, 25),
	},
	{
		albumId: "6982611",
		date: new Date(2024, 1, 26),
	},
	{
		albumId: "423868847",
		date: new Date(2024, 1, 27),
	},
	{
		albumId: "60322892",
		date: new Date(2024, 1, 28),
	},
	{
		albumId: "1440807",
		date: new Date(2024, 1, 29),
	},
	{
		albumId: "93038342",
		date: new Date(2024, 2, 1),
	},
	{
		albumId: "107638",
		date: new Date(2024, 2, 2),
	},
	{
		albumId: "384314",
		date: new Date(2024, 2, 3),
	},
	{
		albumId: "476178105",
		date: new Date(2024, 2, 4),
	},
	{
		albumId: "231352",
		date: new Date(2024, 2, 5),
	},
	{
		albumId: "79786972",
		date: new Date(2024, 2, 6),
	},
];

const isCurrentDay = (date: Date) => {
	const currentDate = new Date();
	// Check if the current date matches the day to show
	return (
		currentDate.getDate() === date.getDate() &&
		currentDate.getMonth() === date.getMonth() &&
		currentDate.getFullYear() === date.getFullYear()
	);
};

const AlbumOfTheDay = () => {
	const albumToday = albums.find((album) => isCurrentDay(album.date));

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumToday!.albumId },
		})
	);

	return (
		<Metadata
			title={album.title}
			cover={album.cover_big ?? ""}
			tags={[
				album.release_date,
				album.duration
					? `${formatMs(album.duration * 1000)}`
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
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { feed = "recent" } = Route.useSearch();
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();
	const { data: profile } = api.profiles.me.useQuery();

	return (
		<div className="flex flex-col gap-8">
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
			{!profile && <RecentFeedReviews input={{ limit: 20 }} />}
		</div>
	);
}
