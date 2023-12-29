"use client";

import { buttonVariants } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SpotifyAlbum, SpotifyArtist } from "@/types/spotify";
import { useDebounce } from "@/utils/hooks";
import { useRecents } from "@/utils/recents";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../app/_trpc/react";
import { AlbumItem } from "./resource/album/AlbumItem";

const ArtistItem = ({
	artist,
	onClick,
}: {
	artist: SpotifyArtist;
	onClick: () => void;
}) => {
	const artistImage = artist.images?.find((i) => i.url);

	return (
		<Link
			href={`/artists/${artist.id}`}
			onClick={onClick}
			className="flex w-full min-w-0 flex-row items-center gap-4 rounded"
		>
			<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded-full">
				{artistImage ? (
					<Image
						alt={artist.name}
						src={artistImage.url}
						fill
						className="object-cover"
					/>
				) : (
					<div className="h-full w-full bg-muted"></div>
				)}
			</div>
			<p className="flex flex-1 truncate font-medium">{artist.name}</p>
		</Link>
	);
};

const SearchBar = () => {
	const [open, setOpen] = useState(false);
	const { recents, addRecent } = useRecents();
	const [query, setQuery] = useState("");

	const q = useDebounce(query, 500);

	const { data, isFetching } = trpc.resource.search.useQuery(q, {
		enabled: query.length > 0,
		refetchOnWindowFocus: false,
	});

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					setQuery("");
				}
				setOpen(open);
			}}
			open={open}
		>
			<DialogTrigger>
				<>
					<Input
						placeholder="Search"
						readOnly
						className="hidden sm:block"
					/>
					<div
						className={buttonVariants({
							variant: "outline",
							size: "icon",
							className: "sm:hidden",
						})}
						aria-label="Search"
					>
						<Search size={20} />
					</div>
				</>
			</DialogTrigger>
			<DialogContent className="flex h-full w-full max-w-none flex-col gap-0 p-0 sm:h-[80%] sm:max-h-[800px] sm:max-w-md sm:p-0">
				<div className="flex items-center border-b pr-10">
					<Search size={20} className="ml-4 text-muted-foreground" />
					<input
						id="name"
						autoComplete="off"
						placeholder="Search"
						value={query}
						className="flex-1 border-0 bg-background py-4 pl-4 text-base outline-none"
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				{isFetching ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="animate-spin" size={35} />
					</div>
				) : data ? (
					<>
						{data.albums.items.length > 0 ||
						data.artists.items.length > 0 ? (
							<ScrollArea className="flex flex-col gap-3 px-4">
								<div className="flex flex-col gap-3 py-4">
									{data.albums.items.length > 0 && (
										<h4>Albums</h4>
									)}
									{data.albums.items.map((album, index) => (
										<AlbumItem
											album={album}
											name={album.name}
											category="ALBUM"
											onClick={() => {
												addRecent(album);
												setOpen(false);
												setQuery("");
											}}
											key={index}
										/>
									))}
									{data.artists.items.length > 0 && (
										<h4 className="mt-3">Artists</h4>
									)}
									{data.artists.items.map((artist, index) => (
										<ArtistItem
											onClick={() => {
												addRecent(artist);
												setOpen(false);
												setQuery("");
											}}
											artist={artist}
											key={index}
										/>
									))}
								</div>
							</ScrollArea>
						) : (
							<div className="flex flex-1 items-center justify-center">
								<p className="text-muted-foreground">
									No results found
								</p>
							</div>
						)}
					</>
				) : recents.length > 0 ? (
					<ScrollArea className="px-4">
						<h4 className="my-4">Recents</h4>
						<div className="flex flex-1 flex-col justify-start gap-3">
							{recents.map((recent, index) =>
								"followers" in recent ? (
									<ArtistItem
										onClick={() => setOpen(false)}
										artist={recent}
										key={index}
									/>
								) : (
									<AlbumItem
										album={recent as SpotifyAlbum}
										name={recent.name}
										category="ALBUM"
										onClick={() => setOpen(false)}
										key={index}
									/>
								)
							)}
						</div>
					</ScrollArea>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<p className="text-muted-foreground">
							No recent searches
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default SearchBar;
