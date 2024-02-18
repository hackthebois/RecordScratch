import CommunityReviews from "@/components/CommunityReviews";
import { Pending } from "@/components/Pending";
import { buttonVariants } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { queryClient } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { formatMs } from "@/utils/date";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/albums/$albumId/songs/$songId/")({
	component: Song,
	pendingComponent: Pending,
	loader: ({ params: { albumId } }) =>
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/album/{id}",
				input: {
					id: albumId,
				},
			})
		),
});

function Song() {
	const { albumId, songId } = Route.useParams();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: {
				id: albumId,
			},
		})
	);

	const song = album.tracks.data.find((track) => track.id === Number(songId))!;

	const resource: Resource = {
		parentId: String(album.id),
		resourceId: String(song.id),
		category: "SONG",
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				{song.album.cover_big && (
					<img
						width={250}
						height={250}
						alt={`${song.album.title} cover`}
						src={song.album.cover_big}
						className="w-[250px] self-center rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">SONG</p>
					<h1 className="text-center sm:text-left">{song.title}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{album.release_date}</Tag>
						{song.explicit_lyrics && <Tag variant="outline">Explicit</Tag>}
						<Tag variant="outline">{formatMs(song.duration * 1000)}</Tag>
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
				</div>
			</div>
			<Tabs defaultValue="reviews">
				<TabsList>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
				</TabsList>
				<TabsContent value="reviews">
					<CommunityReviews resource={resource} pageLimit={20} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
