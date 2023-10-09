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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "./_trpc/react";

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
	onClick,
}: {
	album: SpotifyAlbum;
	onClick: () => void;
}) => {
	const router = useRouter();
	const albumImage = album.images.find((i) => i.url);

	return (
		<Link
			onClick={onClick}
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
				<p className="w-full truncate text-base">{album.name}</p>
				{album.artists.map((artist) => (
					<button
						key={artist.id}
						onClick={(e) => {
							e.preventDefault();
							close();
							router.push(`/artists/${artist.id}`);
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
	const { recents, addRecent } = useRecents();
	const [query, setQuery] = useState("");

	const q = useDebounce(query, 500);

	const { data, isFetching } = trpc.spotify.search.useQuery(q, {
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
							size: "icon",
							variant: "outline",
							className: "sm:hidden",
						})}
					>
						<Search size={20} />
					</div>
				</>
			</DialogTrigger>
			<DialogContent className="flex h-full w-full flex-col gap-0 p-0 sm:max-h-[70%] sm:max-w-[500px] sm:p-0">
				<div className="flex items-center border-b pr-10">
					<Search size={20} className="ml-4 text-muted-foreground" />
					<input
						id="name"
						autoComplete="off"
						placeholder="Search"
						value={query}
						className="flex-1 border-0 py-4 pl-4 text-base outline-none"
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
							<ScrollArea className="px-4">
								{data.albums.items.length > 0 && (
									<>
										<h4 className="my-4">Albums</h4>
										<div className="flex flex-col gap-3">
											{data.albums.items.map(
												(album, index) => (
													<AlbumItem
														album={album}
														onClick={() => {
															addRecent(album);
															setOpen(false);
															setQuery("");
														}}
														key={index}
													/>
												)
											)}
										</div>
									</>
								)}
								{data.artists.items.length > 0 && (
									<>
										<h4 className="my-4">Artists</h4>
										<div className="flex flex-col gap-3">
											{data.artists.items.map(
												(artist, index) => (
													<ArtistItem
														onClick={() => {
															addRecent(artist);
															setOpen(false);
															setQuery("");
														}}
														artist={artist}
														key={index}
													/>
												)
											)}
										</div>
									</>
								)}
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
