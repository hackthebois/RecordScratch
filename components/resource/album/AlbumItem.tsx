"use client";

import { Resource } from "@/types/rating";
import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlbumImage from "./AlbumImage";

export const AlbumItem = ({
	album,
	name,
	category,
	showType,
	onClick,
}: {
	album: SpotifyAlbum;
	name: string;
	category: Resource["category"];
	showType?: boolean;
	onClick?: () => void;
}) => {
	const router = useRouter();

	return (
		<Link
			onClick={onClick}
			href={`/albums/${album.id}`}
			className="flex flex-row items-center gap-4 rounded"
		>
			<div className="relative h-16 w-16 min-w-[64px] rounded">
				<AlbumImage album={album} size={64} />
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{name}</p>
				<div className="flex gap-1">
					{album.artists.map((artist) => (
						<button
							key={artist.id}
							onClick={(e) => {
								e.preventDefault();
								close();
								router.push(`/artists/${artist.id}`);
							}}
							className="truncate py-1 text-sm text-muted-foreground hover:underline"
						>
							{artist.name}
						</button>
					))}
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
