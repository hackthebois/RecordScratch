import Metadata from "@/components/Metadata";
import { Seo } from "@/components/Seo";
import { RatingDialog } from "@/components/rating/RatingDialog";
import { ReviewDialog } from "@/components/review/ReviewDialog";
import { ReviewsList } from "@/components/review/ReviewsList";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { SignInRateButton } from "@/components/signIn/SignInRateButton";
import { SignInReviewButton } from "@/components/signIn/SignInReviewButton";
import { buttonVariants } from "@/components/ui/Button";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getQueryOptions } from "@/lib/deezer";
import { api, queryClient } from "@/trpc/react";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
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

	const tags = [
		album.release_date,
		...(song.explicit_lyrics ? ["Explicit"] : []),
		formatDuration(song.duration),
	];

	return (
		<div className="flex flex-col gap-6">
			<Seo
				title={`${song.title} by ${album.artist?.name}`}
				description={[
					`${song.title} by ${album.artist?.name}`,
					...tags,
				].join(", ")}
				imageUrl={album.cover_big ?? undefined}
				path={`/albums/${album.id}/songs/${song.id}`}
				keywords={[song.title, album.artist?.name, ...tags].join(", ")}
			/>
			<Metadata
				title={song.title}
				cover={album.cover_big ?? ""}
				type="SONG"
				tags={tags}
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
						<RatingDialog
							userId={profile.userId}
							resource={resource}
							name={song.title}
						/>
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
					<div className="flex w-full gap-2">
						{profile ? (
							<ReviewDialog
								userId={profile.userId}
								resource={resource}
								name={song.title}
							/>
						) : (
							<SignInReviewButton />
						)}
					</div>
					<ReviewsList
						filters={{
							resourceId: resource.resourceId,
							category: resource.category,
							ratingType: "REVIEW",
						}}
						limit={20}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
