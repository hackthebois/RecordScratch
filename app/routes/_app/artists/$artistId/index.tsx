import Metadata from "@/components/Metadata";
import SongTable from "@/components/SongTable";
import AlbumList from "@/components/album/AlbumList";
import { ArtistItem } from "@/components/artist/ArtistItem";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/PendingComponent";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { queryClient } from "@/trpc/react";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_app/artists/$artistId/")({
	component: Artist,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				tab: z.enum(["related", "discography"]).optional(),
			})
			.parse(search);
	},
	loader: ({ params: { artistId } }) => {
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/artist/{id}",
				input: {
					id: artistId,
				},
			})
		);
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/artist/{id}/top",
				input: {
					id: artistId,
				},
			})
		);
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/artist/{id}/albums",
				input: {
					id: artistId,
				},
			})
		);
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/artist/{id}/related",
				input: {
					id: artistId,
				},
			})
		);
	},
});

function Artist() {
	const { artistId } = Route.useParams();
	const { tab = "top-songs" } = Route.useSearch();
	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const { data: artist } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}",
			input: {
				id: artistId,
			},
		})
	);
	const { data: top } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/top",
			input: {
				id: artistId,
			},
		})
	);
	const { data: albums } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/albums",
			input: {
				id: artistId,
			},
		})
	);
	const { data: artists } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/related",
			input: {
				id: artistId,
			},
		})
	);

	return (
		<div className="flex flex-col gap-6">
			<Metadata
				title={artist.name}
				cover={artist.picture_big ?? ""}
				tags={[`${artist.nb_album} Albums`]}
				type="ARTIST"
			>
				<Suspense fallback={null}>
					<RatingInfo
						resource={{
							resourceId: String(artist.id),
							category: "ARTIST",
						}}
					/>
				</Suspense>
			</Metadata>
			<Tabs value={tab}>
				<TabsList>
					<TabsTrigger
						value="top-songs"
						onClick={() =>
							navigate({
								search: {
									tab: undefined,
								},
							})
						}
					>
						Top Songs
					</TabsTrigger>
					<TabsTrigger
						value="related"
						onClick={() =>
							navigate({
								search: {
									tab: "related",
								},
							})
						}
					>
						Related
					</TabsTrigger>
					<TabsTrigger
						value="discography"
						onClick={() =>
							navigate({
								search: {
									tab: "discography",
								},
							})
						}
					>
						Discography
					</TabsTrigger>
				</TabsList>
				<TabsContent value="top-songs">
					<SongTable songs={top.data} />
				</TabsContent>
				<TabsContent value="related" className="flex flex-col gap-4">
					{artists.data.map((artist) => (
						<ArtistItem
							artistId={String(artist.id)}
							initialArtist={artist}
							key={artist.id}
						/>
					))}
				</TabsContent>
				<TabsContent value="discography">
					<AlbumList albums={albums.data} type="wrap" field="date" />
				</TabsContent>
			</Tabs>
		</div>
	);
}
