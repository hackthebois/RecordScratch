import AlbumImage from "@/components/resource/album/AlbumImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { Resource } from "@/types/rating";
import { Album, deezer } from "@/utils/deezer";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export const RatingItem = ({
	initial,
	resource: { resourceId, category },
	showType,
	onClick,
}: {
	initial?: {
		album: Album;
		name: string;
	};
	resource: {
		resourceId: string;
		category: Resource["category"];
	};
	showType?: boolean;
	onClick?: () => void;
}) => {
	const queryKey = [category.toLowerCase(), resourceId];
	const { data, isLoading } = useQuery({
		queryKey,
		queryFn: async () => {
			if (category === "SONG") {
				const song = await deezer({
					route: `/track/{id}`,
					input: {
						id: resourceId,
					},
				});
				return {
					album: song.album,
					name: song.title,
				};
			} else {
				const album = await deezer({
					route: `/album/{id}`,
					input: {
						id: resourceId,
					},
				});
				return {
					album,
					name: album.title,
				};
			}
		},
		initialData: initial,
	});

	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className="flex flex-row items-center gap-4 rounded">
				<Skeleton className="h-16 w-16 rounded" />
				<div className="flex flex-1 flex-col gap-1">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-16" />
				</div>
			</div>
		);
	}

	const link =
		category === "SONG"
			? {
					to: `/albums/$albumId/songs/$songId`,
					params: {
						albumId: String(data?.album.id),
						songId: resourceId,
					},
				}
			: {
					to: `/albums/$albumId`,
					params: {
						albumId: resourceId,
					},
				};

	if (data) {
		return (
			<Link onClick={onClick} {...link} className="flex flex-row items-center gap-4 rounded">
				<div className="relative h-16 w-16 min-w-[64px] rounded">
					<AlbumImage album={data.album} size={64} />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium">{data.name}</p>
					<div className="flex gap-1">
						<button
							key={data.album.artist?.id}
							onClick={(e) => {
								e.preventDefault();
								close();
								navigate({
									to: "/artists/$artistId",
									params: {
										artistId: String(data.album.artist?.id),
									},
								});
								navigate({
									to: "/",
								});
							}}
							className="truncate py-1 text-sm text-muted-foreground hover:underline"
						>
							{data.album.artist?.name}
						</button>
						{showType && (
							<p className="truncate py-1 text-sm text-muted-foreground">
								{category === "SONG" ? "• Song" : "• Album"}
							</p>
						)}
					</div>
				</div>
			</Link>
		);
	}
};
