"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import Spinner from "ui/src/Spinner";
import { z } from "zod";
import { env } from "../env.mjs";
import { useDebounce } from "../lib/hooks";
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

const ArtistItem = ({ artist }: { artist: SpotifyArtist }) => {
	const artistImage = artist.images.find((i) => i.url);

	return (
		<Link
			href="/"
			className="flex flex-row items-center rounded p-2 transition-colors hover:bg-elevation-4"
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
					<div className="h-full w-full bg-elevation-4"></div>
				)}
			</div>
			<p className="ml-4 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base">
				{artist.name}
			</p>
		</Link>
	);
};

const AlbumItem = ({ album }: { album: SpotifyAlbum }) => {
	const albumImage = album.images.find((i) => i.url);

	return (
		<Link
			href="/"
			className="flex flex-1 flex-row items-center rounded p-2 transition-colors hover:bg-elevation-4"
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
					<div className="h-full w-full bg-elevation-4" />
				)}
			</div>
			<p className="ml-4 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base">
				{album.name}
			</p>
		</Link>
	);
};

const SearchBar = () => {
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const debouncedSearch = useDebounce(searchValue, 150);

	const { data, isFetching } = useQuery(
		["search", debouncedSearch],
		() => search(debouncedSearch),
		{
			enabled: searchValue.length > 0,
		}
	);

	useEffect(() => {
		if (searchModalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [searchModalOpen]);

	return (
		<>
			<button
				onClick={() => setSearchModalOpen(true)}
				className="mx-4 flex max-w-xs flex-1 items-center rounded border border-elevation-4 bg-elevation-2 px-4 py-2 text-left text-sm text-gray-400 transition-colors hover:border-gray-400"
			>
				<MdSearch size={18} className="mr-2" />
				<p>Search</p>
			</button>
			{searchModalOpen && (
				<div
					onClick={(e) => {
						e.preventDefault();
						setSearchValue("");
						setSearchModalOpen(false);
					}}
					className="fixed bottom-0 left-0 right-0 top-0 flex h-screen w-full cursor-pointer flex-col justify-start overflow-hidden bg-elevation-1/80 sm:py-36"
				>
					<div
						className="mx-auto flex h-full w-full cursor-default flex-col bg-elevation-2 p-4 shadow-lg sm:max-w-md sm:rounded"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="mb-4 flex">
							<form className="flex w-full flex-1 rounded border border-elevation-4 bg-elevation-4 text-left text-gray-400 transition-colors focus-within:border-gray-400 hover:border-gray-400">
								<label
									className="flex items-center pl-3"
									htmlFor="search"
								>
									<MdSearch size={24} />
								</label>
								<input
									id="search"
									value={searchValue}
									autoFocus
									onChange={(e) =>
										setSearchValue(e.target.value)
									}
									className="group h-full w-full bg-transparent px-3 py-4 outline-none"
								/>
								{searchValue.length > 0 && (
									<button
										onPointerDown={(e) => {
											e.preventDefault();
											setSearchValue("");
										}}
										className="flex items-center justify-center px-3"
									>
										<MdClose size={24} />
									</button>
								)}
							</form>
							<button
								className="-mr-4 flex items-center justify-center px-4 text-sm sm:hidden"
								onClick={() => setSearchModalOpen(false)}
							>
								Cancel
							</button>
						</div>
						{isFetching ? (
							<div className="flex flex-1 items-center justify-center">
								<Spinner />
							</div>
						) : data ? (
							<div className="overflow-auto">
								{data.albums.length > 0 && (
									<div>
										<h3 className="my-2 text-lg font-bold">
											Albums
										</h3>
										<div className="flex flex-col">
											{data.albums.map((album, index) => (
												<AlbumItem
													album={album}
													key={index}
												/>
											))}
										</div>
									</div>
								)}
								{data.artists.length > 0 && (
									<div>
										<h3 className="mb-2 mt-4 text-lg font-bold">
											Artists
										</h3>
										<div className="flex flex-col">
											{data.artists.map(
												(artist, index) => (
													<ArtistItem
														artist={artist}
														key={index}
													/>
												)
											)}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="flex w-full items-center justify-center py-8 text-sm text-gray-400">
								No recent searches
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default SearchBar;
