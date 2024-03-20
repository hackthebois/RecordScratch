import { Head } from "@/components/Head";
import Metadata from "@/components/Metadata";
import { InfiniteCommunityReviews } from "@/components/infinite/InfiniteCommunityReviews";
import { RatingDialog } from "@/components/rating/RatingDialog";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { SignInRateButton } from "@/components/signIn/SignInRateButton";
import { buttonVariants } from "@/components/ui/Button";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api, queryClient } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { formatDuration } from "@/utils/date";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/albums/$albumId/songs/$songId/")({
	component: Song,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	loader: ({ params: { albumId } }) => {
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/album/{id}/tracks",
				input: { id: albumId, limit: 1000 },
			})
		);
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/album/{id}",
				input: { id: albumId },
			})
		);
	},
});

function Song() {
	const { albumId, songId } = Route.useParams();
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId },
		})
	);
	const { data: tracks } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}/tracks",
			input: { id: albumId, limit: 1000 },
		})
	);
	const song = tracks.data.find((track) => track.id === Number(songId))!;

	const resource: Resource = {
		parentId: String(album.id),
		resourceId: String(song.id),
		category: "SONG",
	};

	return (
		<div className="flex flex-col gap-6">
			<Head title={song.title} description={album.artist?.name} />
			<Metadata
				title={song.title}
				cover={album.cover_big ?? ""}
				type="SONG"
				tags={[
					album.release_date,
					song.explicit_lyrics ? "Explicit" : undefined,
					formatDuration(song.duration),
				]}
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
				<div className="flex items-center gap-4">
					<RatingInfo resource={resource} />
					{profile ? (
						<RatingDialog resource={resource} name={song.title} />
					) : (
						<SignInRateButton />
					)}
				</div>
				<Link
					to="/albums/$albumId"
					params={{
						albumId: String(album.id),
					}}
					className={buttonVariants({
						size: "sm",
						variant: "secondary",
					})}
				>
					Go to album
				</Link>
			</Metadata>
			<Tabs defaultValue="reviews">
				<TabsList>
					<TabsTrigger value="reviews" className="flex-1">
						Reviews
					</TabsTrigger>
				</TabsList>
				<TabsContent value="reviews">
					<InfiniteCommunityReviews
						resource={resource}
						pageLimit={20}
						name={song.title}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
