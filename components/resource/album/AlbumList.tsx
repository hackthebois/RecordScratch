"use client";

import { useState } from "react";
import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { ScrollArea } from "../../ui/ScrollArea";
import AlbumImage from "./AlbumImage";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
	albums: SpotifyAlbum[];
	type?: "wrap" | "scroll";
	field?: "date" | "artist";
};

const AlbumList = ({ albums, field = "artist", type = "scroll" }: Props) => {
	const listAlbums = albums;

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
			// <ScrollArea orientation="horizontal" className="">
			<Carousel
				opts={{
					align: "start",
				}}
				className="w-full"
			>
				<CarouselContent className="flex">
					{Array.from(listItems).map((listitem, index) => (
						<CarouselItem
							key={index}
							className="md:basis-1/2 lg:basis-1/6"
						>
							{listitem}
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute top-20" />
				<CarouselNext className="absolute top-20" />
			</Carousel>
			// </ScrollArea>
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
