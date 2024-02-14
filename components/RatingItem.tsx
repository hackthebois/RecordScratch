"use client";

import { Album, deezer } from "@/app/_api/deezer";
import { Resource } from "@/types/rating";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlbumImage from "./resource/album/AlbumImage";

export const SongItem = ({ id }: { id: string }) => {
	const { data: song } = useSuspenseQuery({
		queryKey: ["song", id],
		queryFn: () =>
			deezer({
				route: `/track/{id}`,
				input: {
					id,
				},
			}),
	});

	return (
		<RatingItem
			album={song.album}
			name={song.title}
			resource={{ resourceId: id, category: "SONG" }}
		/>
	);
};

export const AlbumItem = ({ id }: { id: string }) => {
	const { data: album } = useSuspenseQuery({
		queryKey: ["album", id],
		queryFn: () =>
			deezer({
				route: `/album/{id}`,
				input: {
					id,
				},
			}),
	});

	return (
		<RatingItem
			album={album}
			name={album.title}
			resource={{ resourceId: id, category: "ALBUM" }}
		/>
	);
};

export const RatingItem = ({
	album,
	name,
	resource: { resourceId, category },
	showType,
	onClick,
}: {
	album: Album;
	name: string;
	resource: {
		resourceId: string;
		category: Resource["category"];
	};
	showType?: boolean;
	onClick?: () => void;
}) => {
	const router = useRouter();

	return (
		<Link
			onClick={onClick}
			href={`/${category.toLowerCase()}s/${resourceId}`}
			className="flex flex-row items-center gap-4 rounded"
			prefetch={false}
		>
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
							router.push(`/artists/${album.artist?.id}`);
						}}
						className="truncate py-1 text-sm text-muted-foreground hover:underline"
					>
						{album.artist?.name}
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
};
