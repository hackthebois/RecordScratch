import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";
import Link from "next/link";

const AlbumList = ({ albums }: { albums: SpotifyAlbum[] }) => {
	return (
		<div className="flex w-full gap-4 overflow-hidden overflow-x-auto">
			{albums.slice(0, 6).map((album, index) => (
				<div
					className="mb-4 flex min-w-[144px] flex-1 flex-col"
					key={index}
				>
					<Link href={`/albums/${album.id}`}>
						<div className="overflow-hidden rounded-md">
							<Image
								src={album.images[0].url}
								alt={`${album.name} cover`}
								width={144}
								height={144}
								className="aspect-square h-auto w-auto object-cover transition-all hover:scale-105"
							/>
						</div>
						<p className="mb-1 mt-2 truncate text-sm">
							{album.name}
						</p>
					</Link>
					{album.artists.slice(0, 1).map((artist, index) => (
						<Link
							href={`/artists/${artist.id}`}
							className="text-xs text-muted-foreground hover:underline"
							key={index}
						>
							{artist.name}
						</Link>
					))}
				</div>
			))}
		</div>
	);
};

export default AlbumList;
