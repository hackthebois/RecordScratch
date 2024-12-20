import Metadata from "@/components/Metadata";
import { Seo } from "@/components/Seo";
import AlbumList from "@/components/album/AlbumList";
import { ReviewsList } from "@/components/review/ReviewsList";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { buttonVariants } from "@/components/ui/Button";
import { NotFound } from "@/components/ui/NotFound";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getQueryOptions } from "@/lib/deezer";
import { api, apiUtils } from "@/trpc/react";
import { formatDuration } from "@recordscratch/lib";
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
		apiUtils.misc.albumOfTheDay.ensureData();
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
	if (!album) return <NotFound />;

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
			<Seo
				title="Recordscratch: Where Music Meets Community"
				description="Recordscratch is the ultimate music-rating and social hub. Find new music, rate your recent listens, and connect with fellow music enthusiasts."
				keywords="music, rating, community, social, album, artist, song, review, record, scratch"
			/>
			<AlbumOfTheDay />
			{trending && (
				<>
					<h2>Trending Albums</h2>
					<AlbumList
						albums={trending.map(({ resourceId }) => resourceId)}
					/>
				</>
			)}
			{top && (
				<>
					<h2>Top Albums</h2>
					<AlbumList
						albums={top.map(({ resourceId }) => resourceId)}
					/>
				</>
			)}
			<h2 className="-mb-6">Feed</h2>
			{profile && (
				<>
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
						<ReviewsList
							limit={20}
							filters={{
								following: feed === "following",
								ratingType: "REVIEW",
							}}
						/>
					</Tabs>
				</>
			)}
			{!profile && (
				<ReviewsList
					limit={20}
					filters={{
						ratingType: "REVIEW",
					}}
				/>
			)}
		</div>
	);
}
