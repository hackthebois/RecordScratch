import AlbumImage from "@/components/album/AlbumImage";
import { Resource } from "@/types/rating";
import { Album, getQueryOptions } from "@/utils/deezer";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Skeleton } from "./ui/Skeleton";

export const ResourceItem = ({
	initialAlbum,
	resource,
	showType,
	onClick,
	showLink = true,
}: {
	initialAlbum?: Album;
	resource: Resource;
	showType?: boolean;
	onClick?: () => void;
	showLink?: boolean;
}) => {
	const navigate = useNavigate();
	const albumId =
		resource.category === "SONG" ? resource.parentId : resource.resourceId;

	const { data: album, isLoading } = useQuery({
		...getQueryOptions({
			route: "/album/{id}",
			input: {
				id: albumId,
			},
		}),
		initialData: initialAlbum,
	});

	const { data: tracks, isLoading: isLoadingTracks } = useQuery({
		...getQueryOptions({
			route: "/album/{id}/tracks",
			input: {
				id: albumId,
				limit: 1000,
			},
		}),
		enabled: resource.category === "SONG",
	});

	if (
		isLoading ||
		!album ||
		(resource.category === "SONG" && isLoadingTracks)
	) {
		return (
			<div className="flex flex-row items-center gap-4 rounded">
				<Skeleton className="relative h-16 w-16 min-w-[64px] rounded" />
				<div className="flex flex-col gap-2">
					<Skeleton className="mb-1 h-4 w-32" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		);
	}

	const name =
		resource.category === "SONG"
			? tracks?.data.find(
					(track) => track.id === Number(resource.resourceId)
				)?.title
			: album?.title;

	const link =
		resource.category === "SONG"
			? {
					to: `/albums/$albumId/songs/$songId`,
					params: {
						albumId: String(album?.id),
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
		<Link
			onClick={() => {
				if (onClick) {
					onClick();
				}
			}}
			{...(showLink ? link : {})}
			className="link-no-drag flex flex-row items-center gap-4 rounded"
		>
			<div className="relative h-16 w-16 min-w-[64px] rounded">
				<AlbumImage album={album} />
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{name}</p>
				<div className="flex gap-1">
					<button
						key={album.artist?.id}
						onClick={() => {
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
							{resource.category === "SONG"
								? "• Song"
								: "• Album"}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
