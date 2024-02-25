import CommunityReviews from "@/components/CommunityReviews";
import Metadata from "@/components/Metadata";
import { RatingDialog } from "@/components/RatingDialog";
import { SignInRateButton } from "@/components/SignInRateButton";
import SongTable from "@/components/SongTable";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api, queryClient } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { formatMs } from "@/utils/date";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
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
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { albumId } = Route.useParams();
	const { tab = "songs" } = Route.useSearch();
	const [profile] = api.profiles.me.useSuspenseQuery();

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId },
		})
	);

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	return (
		<div className="flex flex-col gap-6">
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
				<div className="flex items-center gap-4">
					<RatingInfo resource={resource} />
					{profile ? (
						<RatingDialog resource={resource} name={album.title} />
					) : (
						<SignInRateButton />
					)}
				</div>
			</Metadata>
			<Tabs value={tab}>
				<TabsList>
					<TabsTrigger
						value="songs"
						onClick={() =>
							navigate({
								search: {
									tab: undefined,
								},
							})
						}
					>
						Songs
					</TabsTrigger>
					<TabsTrigger
						value="reviews"
						onClick={() =>
							navigate({
								search: {
									tab: "reviews",
								},
							})
						}
					>
						Reviews
					</TabsTrigger>
				</TabsList>
				<TabsContent value="songs">
					<SongTable songs={album.tracks?.data ?? []} />
				</TabsContent>
				<TabsContent value="reviews">
					<CommunityReviews
						resource={resource}
						pageLimit={20}
						name={album.title}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
