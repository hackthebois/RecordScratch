"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
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
	const listAlbums = albums;

	const listItems = listAlbums.map((album, index) => (
		<div className="mb-4 flex w-[144px] flex-1 flex-col" key={index}>
			<Link href={`/albums/${album.id}`} prefetch={false}>
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
						prefetch={false}
					>
						{artist.name}
					</Link>
				))}
		</div>
	));

	if (type === "scroll") {
		return (
			<div>
				{/* Carousel for large screens */}
				<Carousel
					opts={{
						align: "start",
					}}
					className="hidden lg:flex"
				>
					<CarouselContent className="">
						{Array.from(listItems).map((listitem, index) => (
							<CarouselItem key={index} className="lg:basis-1/6">
								<div className="p-2">{listitem}</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="mt-[-30px] grid place-items-center" />
					<CarouselNext className="mt-[-30px] grid place-items-center" />
				</Carousel>

				{/* ScrollArea for medium and smaller screens */}
				<ScrollArea
					orientation="horizontal"
					className="-mx-4 sm:-mx-8 lg:hidden"
				>
					<div className="flex gap-4 px-4 sm:px-8">{listItems}</div>
				</ScrollArea>
			</div>
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
