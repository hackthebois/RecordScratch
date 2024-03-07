import CommunityReviews from "@/components/CommunityReviews";
import { Head } from "@/components/Head";
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
			data: album?.tracks?.data,
		},
	});

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	return (
		<div className="flex flex-col gap-6">
			<Head title={album.title} description={album.artist?.name} />
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
					<TabsTrigger value="songs">
						<Link
							params={{ albumId }}
							search={{
								tab: undefined,
							}}
						>
							Songs
						</Link>
					</TabsTrigger>
					<TabsTrigger value="reviews">
						<Link
							params={{ albumId }}
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
							songs?.data.map((song) => ({ ...song, album })) ??
							[]
						}
					/>
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
