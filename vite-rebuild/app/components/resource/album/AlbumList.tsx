import { ScrollArea } from "@/components/ui/ScrollArea";
import { Album, deezer } from "@/utils/deezer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import AlbumImage from "./AlbumImage";

const AlbumItem = ({
	album: albumOrId,
	field,
}: {
	album: string | Album;
	field: "date" | "artist";
}) => {
	const { data: album } = useQuery({
		queryKey: ["album", albumOrId],
		queryFn: () =>
			deezer({
				route: `/album/{id}`,
				input: {
					id: typeof albumOrId === "string" ? albumOrId : String(albumOrId.id),
				},
			}),
		initialData: typeof albumOrId === "string" ? undefined : albumOrId,
	});

	if (!album) {
		return null;
	}

	return (
		<div className="mb-4 flex w-[144px] flex-1 flex-col">
			<Link to={"/"}>
				<AlbumImage album={album} size={144} />
				<p className="mt-1 truncate font-medium">{album.title}</p>
				{field === "date" && (
					<p className="py-1 text-sm text-muted-foreground">{album.release_date}</p>
				)}
			</Link>
			{field === "artist" && (
				<Link to={"/"} className="py-1 text-sm text-muted-foreground hover:underline">
					{album.artist?.name}
				</Link>
			)}
		</div>
	);
};

const AlbumList = ({
	albums,
	field = "artist",
	type = "scroll",
}: {
	albums: string[] | Album[];
	type?: "wrap" | "scroll";
	field?: "date" | "artist";
}) => {
	const listAlbums = albums;

	const listItems = listAlbums.map((album, index) => (
		<AlbumItem key={index} album={album} field={field} />
	));

	if (type === "scroll") {
		return (
			<ScrollArea orientation="horizontal" className="-mx-4 sm:-mx-8 lg:hidden">
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
