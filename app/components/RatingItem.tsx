import AlbumImage from "@/components/album/AlbumImage";
import { Resource } from "@/types/rating";
import { Album, getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export const RatingItem = ({
	initial,
	resource,
	showType,
	onClick,
}: {
	initial?: {
		album: Album;
		name: string;
	};
	resource: Resource;
	showType?: boolean;
	onClick?: () => void;
}) => {
	const { data: album } = useSuspenseQuery({
		...getQueryOptions({
			route: "/album/{id}",
			input: {
				id: resource.category === "SONG" ? resource.parentId : resource.resourceId,
			},
		}),
		initialData: initial?.album,
	});

	const name =
		resource.category === "SONG"
			? album.tracks?.data.find((track) => track.id === Number(resource.resourceId))?.title
			: album.title;

	const navigate = useNavigate();

	const link =
		resource.category === "SONG"
			? {
					to: `/albums/$albumId/songs/$songId`,
					params: {
						albumId: String(album.id),
						songId: resource.resourceId,
					},
				}
			: {
					to: `/albums/$albumId`,
					params: {
						albumId: resource.resourceId,
					},
				};

	return (
		<Link onClick={onClick} {...link} className="flex flex-row items-center gap-4 rounded">
			<div className="relative h-16 w-16 min-w-[64px] rounded">
				<AlbumImage album={album} size={64} />
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{name}</p>
				<div className="flex gap-1">
					<button
						key={album.artist?.id}
						onClick={(e) => {
							e.preventDefault();
							close();
							navigate({
								to: "/artists/$artistId",
								params: {
									artistId: String(album.artist?.id),
								},
							});
						}}
						className="truncate py-1 text-sm text-muted-foreground hover:underline"
					>
						{album.artist?.name}
					</button>
					{showType && (
						<p className="truncate py-1 text-sm text-muted-foreground">
							{resource.category === "SONG" ? "• Song" : "• Album"}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
