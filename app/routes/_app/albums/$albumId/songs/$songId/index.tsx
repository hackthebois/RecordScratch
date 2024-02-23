import CommunityReviews from "@/components/CommunityReviews";
import Metadata from "@/components/Metadata";
import { Pending } from "@/components/Pending";
import { RatingDialog } from "@/components/RatingDialog";
import { SignInRateButton } from "@/components/SignInRateButton";
import { buttonVariants } from "@/components/ui/Button";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api, queryClient } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { formatMs } from "@/utils/date";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/albums/$albumId/songs/$songId/")({
	component: Song,
	pendingComponent: Pending,
	loader: ({ params: { albumId } }) => {
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
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId },
		})
	);
	const song = album.tracks.data.find(
		(track) => track.id === Number(songId)
	)!;

	const { data: profile } = api.profiles.me.useQuery();

	const resource: Resource = {
		parentId: String(album.id),
		resourceId: String(song.id),
		category: "SONG",
	};

	return (
		<div className="flex flex-col gap-6">
			<Metadata
				title={song.title}
				cover={album.cover_big ?? ""}
				type="SONG"
				tags={[
					album.release_date,
					song.explicit_lyrics ? "Explicit" : undefined,
					formatMs(song.duration * 1000),
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
				<Suspense fallback={<Skeleton className="h-8 w-24" />}>
					<div className="flex items-center gap-4">
						<RatingInfo resource={resource} />
						{profile ? (
							<RatingDialog
								resource={resource}
								name={album.title}
							/>
						) : (
							<SignInRateButton />
						)}
					</div>
				</Suspense>
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
					<CommunityReviews
						resource={resource}
						pageLimit={20}
						name={song.title}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
