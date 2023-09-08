"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "ui/src/Spinner";
import { z } from "zod";
import { env } from "../env.mjs";
import {
	SpotifyAlbum,
	SpotifyAlbumSchema,
	SpotifyArtist,
	SpotifyArtistSchema,
} from "../types/spotify";

const search = async (q: string) => {
	const res = await fetch(
		`${env.NEXT_PUBLIC_SITE_URL}/spotify/search?q=${q}&type=album,artist&limit=4`
	);
	const data = await res.json();
	return z
		.object({
			albums: SpotifyAlbumSchema.array(),
			artists: SpotifyArtistSchema.array(),
		})
		.parse({ albums: data.albums.items, artists: data.artists.items });
};

const ArtistItem = ({
	artist,
	close,
}: {
	artist: SpotifyArtist;
	close: () => void;
}) => {
	const artistImage = artist.images?.find((i) => i.url);

	return (
		<Link
			href="/"
			onClick={close}
			className="hover:bg-elevation-4 flex flex-row items-center rounded transition-colors"
		>
			<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded-full">
				{artistImage ? (
					<Image
						alt={artist.name}
						src={artistImage.url}
						fill
						objectFit="cover"
					/>
				) : (
					<div className="h-full w-full bg-secondary"></div>
				)}
			</div>
			<p className="ml-4 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base">
				{artist.name}
			</p>
		</Link>
	);
};

const AlbumItem = ({
	album,
	close,
}: {
	album: SpotifyAlbum;
	close: () => void;
}) => {
	const router = useRouter();
	const albumImage = album.images.find((i) => i.url);

	return (
		<Link
			onClick={close}
			href={`/albums/${album.id}`}
			className="hover:bg-elevation-4 flex flex-1 flex-row items-center rounded transition-colors"
		>
			<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded">
				{albumImage ? (
					<Image
						alt={album.name}
						src={albumImage.url}
						fill
						objectFit="cover"
					/>
				) : (
					<div className="bg-elevation-4 h-full w-full" />
				)}
			</div>
			<div className="ml-4 w-full overflow-hidden">
				<p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base">
					{album.name}
				</p>
				{album.artists.map((artist) => (
					<button
						key={artist.id}
						onClick={(e) => {
							e.preventDefault();
							close();
							router.push("/");
						}}
						className="mt-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-400 hover:underline "
					>
						{artist.name}
					</button>
				))}
			</div>
		</Link>
	);
};

const SearchBar = () => {
	const [open, setOpen] = useState(false);
	const form = useForm({
		defaultValues: {
			query: "",
		},
	});

	const query = form.watch("query");

	const { data, isFetching } = useQuery(
		["search", query],
		() => search(query),
		{
			enabled: query.length > 0,
		}
	);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger>
				<Input placeholder="Search" />
			</DialogTrigger>
			<DialogContent className="h-full w-full sm:max-h-[70%] sm:max-w-[500px]">
				<Form {...form}>
					<FormField
						control={form.control}
						name="query"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										id="name"
										placeholder="Search"
										className="mt-6"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Form>
				<ScrollArea>
					{isFetching ? (
						<div className="flex flex-1 items-center justify-center">
							<Spinner />
						</div>
					) : data ? (
						<>
							{data.albums.length > 0 && (
								<>
									<h4 className="my-4">Albums</h4>
									<div className="flex flex-col gap-3">
										{data.albums.map((album, index) => (
											<AlbumItem
												album={album}
												close={() => setOpen(false)}
												key={index}
											/>
										))}
									</div>
								</>
							)}
							{data.artists.length > 0 && (
								<>
									<h4 className="my-4">Artists</h4>
									<div className="flex flex-col gap-3">
										{data.artists.map((artist, index) => (
											<ArtistItem
												close={() => setOpen(false)}
												artist={artist}
												key={index}
											/>
										))}
									</div>
								</>
							)}
						</>
					) : (
						<p className="text-center text-muted-foreground">
							No recent searches
						</p>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default SearchBar;
