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
		.object({ albums: SpotifyAlbumSchema.array(), artists: SpotifyArtistSchema.array() })
		.parse({ albums: data.albums.items, artists: data.artists.items });
};

const ArtistItem = ({ artist }: { artist: SpotifyArtist }) => {
	const artistImage = artist.images.find((i) => i.url);

	return (
		<Link
			href="/"
			className="flex items-center flex-row hover:bg-elevation-4 p-2 rounded transition-colors"
		>
			<div className="relative min-w-[64px] w-16 h-16 rounded-full overflow-hidden">
				{artistImage ? (
					<Image alt={artist.name} src={artistImage.url} fill objectFit="cover" />
				) : (
					<div className="w-full h-full bg-elevation-4"></div>
				)}
			</div>
			<p className="overflow-ellipsis ml-4 text-base whitespace-nowrap overflow-hidden w-full">
				{artist.name}
			</p>
		</Link>
	);
};

const AlbumItem = ({ album }: { album: SpotifyAlbum }) => {
	const albumImage = album.images.find((i) => i.url);

	return (
		<Link
			href={"/"}
			className="flex flex-1 items-center flex-row hover:bg-elevation-4 p-2 rounded transition-colors"
		>
			<div className="relative min-w-[64px] w-16 h-16 rounded-xl overflow-hidden">
				{albumImage ? (
					<Image alt={album.name} src={albumImage.url} fill objectFit="cover" />
				) : (
					<div className="w-full h-full bg-elevation-4" />
				)}
			</div>
			<p className="overflow-ellipsis ml-4 text-base whitespace-nowrap overflow-hidden w-full">
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
				className="flex-1 flex items-center px-4 mx-4 text-sm max-w-xs bg-elevation-2 text-gray-400 py-2 rounded text-left border border-elevation-4 hover:border-gray-400 transition-colors"
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
					className="fixed overflow-hidden cursor-pointer top-0 left-0 right-0 bottom-0 w-full h-screen flex justify-start flex-col bg-elevation-1/80 sm:py-36"
				>
					<div
						className="bg-elevation-2 shadow-lg h-full cursor-default mx-auto sm:max-w-md w-full sm:rounded-xl p-4 flex-col flex"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex mb-4">
							<form className="focus-within:border-gray-400 flex-1 flex w-full text-gray-400 rounded text-left border border-elevation-4 hover:border-gray-400 transition-colors bg-elevation-4">
								<label className="pl-3 flex items-center" htmlFor="search">
									<MdSearch size={24} />
								</label>
								<input
									id="search"
									value={searchValue}
									autoFocus
									onChange={(e) => setSearchValue(e.target.value)}
									className="bg-transparent w-full h-full py-4 px-3 outline-none group"
								/>
								{searchValue.length > 0 && (
									<button
										onPointerDown={(e) => {
											e.preventDefault();
											setSearchValue("");
										}}
										className="px-3 flex justify-center items-center"
									>
										<MdClose size={24} />
									</button>
								)}
							</form>
							<button
								className="px-4 flex justify-center items-center -mr-4 text-sm sm:hidden"
								onClick={() => setSearchModalOpen(false)}
							>
								Cancel
							</button>
						</div>
						{isFetching ? (
							<div className="flex-1 flex justify-center items-center">
								<Spinner />
							</div>
						) : data ? (
							<div className="overflow-auto">
								{data.albums.length > 0 && (
									<div>
										<h3 className="text-lg font-bold my-2">Albums</h3>
										<div className="flex flex-col">
											{data.albums.map((album, index) => (
												<AlbumItem album={album} key={index} />
											))}
										</div>
									</div>
								)}
								{data.artists.length > 0 && (
									<div>
										<h3 className="text-lg font-bold mt-4 mb-2">Artists</h3>
										<div className="flex flex-col">
											{data.artists.map((artist, index) => (
												<ArtistItem artist={artist} key={index} />
											))}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="py-8 flex w-full justify-center items-center text-sm text-gray-400">
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
