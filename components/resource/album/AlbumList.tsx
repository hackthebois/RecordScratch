import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { ScrollArea } from "../../ui/ScrollArea";
import AlbumImage from "./AlbumImage";

type Props = {
	albums: SpotifyAlbum[];
	type?: "wrap" | "scroll";
	field?: "date" | "artist";
};

const AlbumList = ({ albums, field = "artist", type = "scroll" }: Props) => {
	const listAlbums = type === "scroll" ? albums.slice(0, 6) : albums;

	const listItems = listAlbums.map((album, index) => (
		<div className="mb-4 flex min-w-[144px] flex-1 flex-col" key={index}>
			<Link href={`/albums/${album.id}`}>
				<AlbumImage album={album} size={144} />
				<p className="mb-1 mt-2 truncate text-sm">{album.name}</p>
			</Link>
			{field === "artist" ? (
				album.artists.slice(0, 1).map((artist, index) => (
					<Link
						href={`/artists/${artist.id}`}
						className="text-xs text-muted-foreground hover:underline"
						key={index}
					>
						{artist.name}
					</Link>
				))
			) : (
				<p className="text-xs text-muted-foreground">
					{album.release_date}
				</p>
			)}
		</div>
	));

	if (type === "scroll") {
		return (
			<ScrollArea orientation="horizontal" className="-mx-4 sm:-mx-8">
				<div className="flex gap-4 px-4 sm:px-8">{listItems}</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{listItems}
			</div>
		);
	}
};

export default AlbumList;
