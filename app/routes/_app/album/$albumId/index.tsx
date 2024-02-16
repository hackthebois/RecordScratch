import SongTable from "@/components/SongTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { formatMs } from "@/utils/date";
import { deezer } from "@/utils/deezer";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/album/$albumId/")({
	component: LayoutComponent,
	loader: ({ params: { albumId } }) =>
		deezer({
			route: `/album/{id}`,
			input: {
				id: albumId,
			},
		}),
});

function LayoutComponent() {
	// const { albumId } = Route.useParams();
	const album = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				<img
					width={250}
					height={250}
					alt={`${album.title} cover`}
					src={album.cover_big}
					className="w-[250px] self-center rounded-xl"
				/>
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						{album.record_type?.toUpperCase()}
					</p>
					<h1 className="text-center sm:text-left">{album.title}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{album.release_date}</Tag>
						{album.duration && (
							<Tag variant="outline">{formatMs(album.duration * 1000)}</Tag>
						)}
						{album.genres?.data.map((genre, index) => (
							<Tag variant="outline" key={index}>
								{genre.name}
							</Tag>
						))}
					</div>
					{/* <Link
						href={`/artists/${album.artist?.id}`}
						className="text-muted-foreground hover:underline"
					>
						{album.artist?.name}
					</Link> */}
				</div>
			</div>
			<Tabs defaultValue="songs">
				<TabsList>
					<TabsTrigger value="songs">Songs</TabsTrigger>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
				</TabsList>
				<TabsContent value="songs">
					<SongTable songs={album.tracks?.data ?? []} />
				</TabsContent>
				<TabsContent value="reviews">
					<div className="flex w-full flex-col gap-4">
						{/* <div className="flex w-full gap-2">
							<ReviewButton
								name={album.title}
								resource={{
									resourceId: String(album.id),
									category: "ALBUM",
								}}
							/>
						</div> */}
						{/* <InfiniteReviews
							id={String(album.id)}
							initialReviews={initialReviews}
							getReviews={getReviews}
							pageLimit={20}
						/> */}
					</div>
				</TabsContent>
			</Tabs>
			<Outlet />
		</div>
	);
}
