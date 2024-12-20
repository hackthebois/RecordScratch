import Metadata from "@/components/Metadata";
import { Seo } from "@/components/Seo";
import SongTable from "@/components/SongTable";
import { AddToList } from "@/components/lists/AddToList";
import { RatingDialog } from "@/components/rating/RatingDialog";
import { ReviewDialog } from "@/components/review/ReviewDialog";
import { ReviewsList } from "@/components/review/ReviewsList";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { SignInRateButton } from "@/components/signIn/SignInRateButton";
import { SignInReviewButton } from "@/components/signIn/SignInReviewButton";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getQueryOptions } from "@/lib/deezer";
import { api, queryClient } from "@/trpc/react";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_app/albums/$albumId/")({
	component: Album,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				tab: z.enum(["reviews"]).optional(),
			})
			.parse(search);
	},
	loader: ({ params: { albumId } }) => {
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/album/{id}",
				input: { id: albumId },
			})
		);
	},
});

function Album() {
	const { albumId } = Route.useParams();
	const { tab = "songs" } = Route.useSearch();
	const [profile] = api.profiles.me.useSuspenseQuery();

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId },
		})
	);

	const { data: songs } = useQuery({
		...getQueryOptions({
			route: "/album/{id}/tracks",
			input: { id: albumId, limit: 1000 },
		}),
		initialData: {
			data: album?.tracks?.data ?? [],
		},
	});

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	const tags = [
		album.release_date,
		album.duration ? `${formatDuration(album.duration)}` : undefined,
		...(album.genres?.data.map((genre) => genre.name) ?? []),
	];

	return (
		<div className="flex flex-col gap-6">
			<Seo
				title={`${album.title} by ${album.artist?.name}`}
				description={[
					`${album.title} by ${album.artist?.name}`,
					...tags,
				].join(", ")}
				imageUrl={album.cover_big ?? undefined}
				path={`/albums/${album.id}`}
				keywords={[album.title, album.artist?.name, ...tags].join(", ")}
			/>
			<Metadata
				title={album.title}
				cover={album.cover_big ?? ""}
				tags={tags}
				type={album.record_type?.toUpperCase() ?? "ALBUM"}
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
				<div className="flex items-center">
					<div className="mr-4">
						<RatingInfo resource={resource} />
					</div>
					{profile ? (
						<div className="flex gap-3">
							<RatingDialog
								resource={resource}
								name={album.title}
								userId={profile.userId}
							/>
							<AddToList
								parentId={String(album.artist?.id)}
								resourceId={String(album.id)}
								category="ALBUM"
							/>
						</div>
					) : (
						<SignInRateButton />
					)}
				</div>
			</Metadata>
			<Tabs value={tab}>
				<TabsList>
					<TabsTrigger value="songs" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: undefined,
							}}
						>
							Songs
						</Link>
					</TabsTrigger>
					<TabsTrigger value="reviews" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: "reviews",
							}}
						>
							Reviews
						</Link>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="songs">
					<SongTable
						songs={
							songs?.data?.map((song) => ({ ...song, album })) ??
							[]
						}
					/>
				</TabsContent>
				<TabsContent value="reviews">
					<div className="flex w-full gap-2">
						{profile ? (
							<ReviewDialog
								userId={profile.userId}
								resource={resource}
								name={album.title}
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
