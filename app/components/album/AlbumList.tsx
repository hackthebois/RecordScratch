import { ScrollArea } from "@/components/ui/ScrollArea";
import { Album, getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import AlbumImage from "./AlbumImage";

const AlbumItem = ({
	albumId,
	field,
	initial,
}: {
	albumId: string;
	field: "date" | "artist";
	initial?: Album;
}) => {
	const { data: album } = useSuspenseQuery({
		...getQueryOptions({
			route: "/album/{id}",
			input: {
				id: albumId,
			},
		}),
		initialData: initial,
	});

	if (!album) {
		return null;
	}

	return (
		<div className="mb-4 flex w-[144px] flex-col">
			<Link
				to={"/albums/$albumId"}
				params={{
					albumId: String(album.id),
				}}
				className="cursor-pointer"
			>
				<AlbumImage album={album} size={144} />
				<p className="mt-1 truncate font-medium">{album.title}</p>
				{field === "date" && (
					<p className="py-1 text-sm text-muted-foreground">{album.release_date}</p>
				)}
			</Link>
			{field === "artist" && (
				<Link
					to="/artists/$artistId"
					params={{
						artistId: String(album.artist?.id),
					}}
					className="py-1 text-sm text-muted-foreground hover:underline"
				>
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
	if (type === "scroll") {
		return (
			<ScrollArea orientation="horizontal" className="-mx-4 sm:-mx-8">
				<div className="flex gap-4 px-4 sm:px-8">
					{albums.map((album, index) => (
						<AlbumItem
							key={index}
							albumId={typeof album === "string" ? album : String(album.id)}
							initial={typeof album === "string" ? undefined : album}
							field={field}
						/>
					))}
				</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="flex flex-wrap gap-4 sm:gap-6 justify-around">
				{albums.map((album, index) => (
					<AlbumItem
						key={index}
						albumId={typeof album === "string" ? album : String(album.id)}
						initial={typeof album === "string" ? undefined : album}
						field={field}
					/>
				))}
			</div>
		);
	}
};

export default AlbumList;
