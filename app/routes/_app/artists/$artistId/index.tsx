import SongTable from "@/components/SongTable";
import AlbumList from "@/components/album/AlbumList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { queryClient } from "@/trpc/react";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/artists/$artistId/")({
	component: Artist,
	pendingComponent: () => <></>,
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
	},
});

function Artist() {
	const { artistId } = Route.useParams();
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

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				{artist.picture_big && (
					<img
						width={250}
						height={250}
						alt={`${artist.name} cover`}
						src={artist.picture_big}
						className="w-[250px] self-center rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">ARTIST</p>
					<h1 className="text-center sm:text-left">{artist.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{artist.nb_album} Albums</Tag>
					</div>
				</div>
			</div>
			<Tabs defaultValue="top-songs">
				<TabsList>
					<TabsTrigger value="top-songs">Top Songs</TabsTrigger>
					<TabsTrigger value="discography">Discography</TabsTrigger>
				</TabsList>
				<TabsContent value="top-songs">
					<SongTable songs={top.data} />
				</TabsContent>
				<TabsContent value="discography">
					<AlbumList albums={albums.data} type="wrap" field="date" />
				</TabsContent>
			</Tabs>
		</div>
	);
}
