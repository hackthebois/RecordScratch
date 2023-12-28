"use client";

import { useState } from "react";
import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { ScrollArea } from "../../ui/ScrollArea";
import AlbumImage from "./AlbumImage";
import { Button } from "@/components/ui/Button";

type Props = {
	albums: SpotifyAlbum[];
	type?: "wrap" | "scroll";
	field?: "date" | "artist";
};

const AlbumList = ({ albums, field = "artist", type = "scroll" }: Props) => {
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 5;
	const totalPages = Math.ceil(albums.length / pageSize);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 0 && newPage < totalPages) {
			setCurrentPage(newPage);
		}
	};

	const listAlbums =
		type === "scroll"
			? albums.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
			: albums;

	const listItems = listAlbums.map((album, index) => (
		<div className="mb-4 flex w-[144px] flex-1 flex-col" key={index}>
			<Link href={`/albums/${album.id}`}>
				<AlbumImage album={album} size={144} />
				<p className="mt-1 truncate font-medium">{album.name}</p>
				{field === "date" && (
					<p className="py-1 text-sm text-muted-foreground">
						{album.release_date}
					</p>
				)}
			</Link>
			{field === "artist" &&
				album.artists.slice(0, 1).map((artist, index) => (
					<Link
						href={`/artists/${artist.id}`}
						className="py-1 text-sm text-muted-foreground hover:underline"
						key={index}
					>
						{artist.name}
					</Link>
				))}
		</div>
	));

	if (type === "scroll") {
		return (
			<ScrollArea orientation="horizontal" className="-mx-8 sm:-mx-12">
				<div className="flex px-8 sm:px-12">
					{currentPage ? (
						<div className="flex-shrink-0">
							<Button
								onClick={() =>
									handlePageChange(currentPage - 1)
								}
								className={`mr-2 h-full rounded bg-black p-4 text-white hover:bg-gray-800 ${
									currentPage === 0
										? "cursor-not-allowed text-gray-300"
										: "hover:bg-gray-200"
								}`}
							>
								&lt;
							</Button>
						</div>
					) : (
						""
					)}
					<div className="flex flex-grow gap-4">{listItems}</div>
					{currentPage != totalPages - 1 ? (
						<div className="flex-shrink-0">
							<Button
								onClick={() =>
									handlePageChange(currentPage + 1)
								}
								className={`mr-2 h-full rounded bg-black p-4 text-white hover:bg-gray-800 ${
									currentPage === totalPages - 1
										? "cursor-not-allowed text-gray-300"
										: "hover:bg-gray-200"
								}`}
							>
								&gt;
							</Button>
						</div>
					) : (
						""
					)}
				</div>
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
