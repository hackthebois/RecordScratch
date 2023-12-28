"use client";

import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlbumImage from "./AlbumImage";

export const AlbumItem = ({
	album,
	song,
	showType,
	onClick,
}: {
	album: SpotifyAlbum;
	song?: string;
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
				<p className="truncate font-medium">
					{song ? song : album.name}
				</p>
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
							{song ? "• Song" : "• Album"}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
