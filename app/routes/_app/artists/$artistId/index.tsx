import { ArtistItem } from "@/components/ArtistItem";
import { Pending } from "@/components/Pending";
import SongTable from "@/components/SongTable";
import AlbumList from "@/components/album/AlbumList";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { queryClient } from "@/trpc/react";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_app/artists/$artistId/")({
	component: Artist,
	pendingComponent: Pending,
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
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				{artist.picture_big && (
					<img
						width={250}
						height={250}
						alt={`${artist.name} cover`}
						src={artist.picture_big}
						className="w-[250px] self-center rounded-xl sm:self-start"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						ARTIST
					</p>
					<h1 className="text-center sm:text-left">{artist.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{artist.nb_album} Albums</Tag>
					</div>
					<RatingInfo
						resource={{
							resourceId: String(artist.id),
							category: "ARTIST",
						}}
					/>
				</div>
			</div>
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
						<ArtistItem artist={artist} key={artist.id} />
					))}
				</TabsContent>
				<TabsContent value="discography">
					<AlbumList albums={albums.data} type="wrap" field="date" />
				</TabsContent>
			</Tabs>
		</div>
	);
}
