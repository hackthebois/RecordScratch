import { ScrollArea } from "@/components/ui/ScrollArea";
import { Album, getQueryOptions } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import AlbumImage from "./AlbumImage";

const AlbumItem = ({
	albumId,
	field,
	initial,
	size,
}: {
	albumId: string;
	field: "date" | "artist";
	initial?: Album;
	size?: number;
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
		<div
			className="flex h-full flex-col"
			style={{
				width: size,
			}}
		>
			<Link
				to={"/albums/$albumId"}
				params={{
					albumId: String(album.id),
				}}
				className="flex w-full cursor-pointer flex-col overflow-hidden"
			>
				<div
					style={{
						width: size,
						height: size,
						maxWidth: size,
						maxHeight: size,
					}}
				>
					<AlbumImage album={album} />
				</div>
				<p className="truncate pt-1 font-medium">{album.title}</p>
				{field === "date" && (
					<p className="text-sm text-muted-foreground">
						{album.release_date}
					</p>
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
			<ScrollArea
				orientation="horizontal"
				className="w-full max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)]"
			>
				<div className="flex gap-4">
					{albums.map((album, index) => (
						<div className="mb-3" key={index}>
							<AlbumItem
								albumId={
									typeof album === "string"
										? album
										: String(album.id)
								}
								initial={
									typeof album === "string"
										? undefined
										: album
								}
								size={144}
								field={field}
							/>
						</div>
					))}
				</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="grid grid-cols-[repeat(auto-fill,minmax(144px,1fr))] gap-3">
				{albums.map((album, index) => (
					<AlbumItem
						key={index}
						albumId={
							typeof album === "string" ? album : String(album.id)
						}
						initial={typeof album === "string" ? undefined : album}
						field={field}
					/>
				))}
			</div>
		);
	}
};

export default AlbumList;
