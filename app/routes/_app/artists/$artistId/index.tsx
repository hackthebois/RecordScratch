import { Head } from "@/components/Head";
import Metadata from "@/components/Metadata";
import SongTable from "@/components/SongTable";
import AlbumList from "@/components/album/AlbumList";
import { ArtistItem } from "@/components/artist/ArtistItem";
import { AddToList } from "@/components/lists/AddToList";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { queryClient } from "@/trpc/react";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
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
					limit: 1000,
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
				limit: 1000,
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
			<Head title={artist.name} />
			<Metadata
				title={artist.name}
				cover={artist.picture_big ?? ""}
				tags={[`${artist.nb_album} Albums`]}
				type="ARTIST"
			>
				<div className="flex flex-row items-center justify-center gap-3">
					<RatingInfo
						resource={{
							resourceId: String(artist.id),
							category: "ARTIST",
						}}
					/>

					<AddToList
						resourceId={String(artist.id)}
						category="ARTIST"
					/>
				</div>
			</Metadata>
			<Tabs value={tab}>
				<TabsList>
					<TabsTrigger value="top-songs" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: undefined,
							}}
						>
							Top Songs
						</Link>
					</TabsTrigger>
					<TabsTrigger value="related" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: "related",
							}}
						>
							Related
						</Link>
					</TabsTrigger>
					<TabsTrigger value="discography" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: "discography",
							}}
						>
							Discography
						</Link>
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
