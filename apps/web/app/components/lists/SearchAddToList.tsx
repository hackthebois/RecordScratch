import { api } from "@/trpc/react";
import { deezer, useDebounce } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { ListPlus, Search } from "lucide-react";
import React, { useState } from "react";
import { ResourceItem } from "../ResourceItem";
import { SearchState } from "../SearchBar";
import { ArtistItem } from "../artist/ArtistItem";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";

export const MusicSearch = ({
	query,
	category,
	listId,
	onNavigate,
	onClick,
}: {
	query: string;
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
	onNavigate: () => void;
	onClick?: () => void;
}) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["search", "search-music", query],
		queryFn: async () => {
			let artists = null;
			let albums = null;
			let songs = null;

			if (category === "ARTIST")
				artists = (
					await deezer({
						route: "/search/artist",
						input: { q: query, limit: 4 },
					})
				).data;
			if (category === "ALBUM")
				albums = (
					await deezer({
						route: "/search/album",
						input: { q: query, limit: 4 },
					})
				).data;
			if (category === "SONG")
				songs = (
					await deezer({
						route: "/search/track",
						input: { q: query, limit: 4 },
					})
				).data;

			return {
				artists: artists,
				albums: albums,
				songs: songs,
			};
		},
		refetchOnMount: false,
		enabled: query.length > 0,
	});

	const list = api.useUtils().lists.resources.get;
	const { mutate } = api.lists.resources.create.useMutation({
		onSettled: async (_data, _error, variables) => {
			if (variables) {
				await list.invalidate({
					listId: variables.listId,
				});
				if (onClick) onClick();
			}
		},
	});

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={() => {}}
			noResults={
				data?.albums?.length === 0 && data?.artists?.length === 0
			}
			hide={{ profiles: true }}
		>
			<div className="flex flex-col gap-3 pb-4">
				{data && (
					<>
						{data.albums && (
							<>
								<h4>Albums</h4>
								{data.albums.map((album, index) => (
									<div
										className="flex flex-col gap-3"
										key={index}
									>
										<ResourceItem
											showLink={false}
											initialAlbum={album}
											resource={{
												parentId: String(
													album.artist?.id
												),
												resourceId: String(album.id),
												category: "ALBUM",
											}}
											onClick={() => {
												mutate({
													resourceId: String(
														album.id
													),
													parentId: String(
														album.artist?.id
													),
													listId,
												});
												onNavigate();
											}}
										/>
									</div>
								))}
							</>
						)}
						{data.artists && (
							<>
								<h4 className="mt-3">Artists</h4>
								{data.artists.map((artist, index) => (
									<div
										className="flex flex-col gap-3"
										key={index}
									>
										<ArtistItem
											showLink={false}
											artistId={String(artist.id)}
											initialArtist={artist}
											imageCss="h-16 w-16"
											onClick={() => {
												mutate({
													resourceId: String(
														artist.id
													),
													listId,
												});
												onNavigate();
											}}
										/>
									</div>
								))}
							</>
						)}
						{data.songs && (
							<>
								<h4 className="mt-3">Songs</h4>
								{data.songs.map((song, index) => (
									<div
										className="flex flex-col gap-3"
										key={index}
									>
										<ResourceItem
											showLink={false}
											resource={{
												parentId: String(song.album.id),
												resourceId: String(song.id),
												category: "SONG",
											}}
											onClick={() => {
												mutate({
													resourceId: String(song.id),
													parentId: String(
														song.album.id
													),
													listId,
												});
												onNavigate();
											}}
										/>
									</div>
								))}
							</>
						)}
					</>
				)}
			</div>
		</SearchState>
	);
};

export const SearchAddToList = ({
	category,
	listId,
	button,
	onClick,
	openMenu,
}: {
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
	button?: React.ReactNode;
	onClick?: () => void;
	openMenu?: boolean;
}) => {
	const [open, setOpen] = useState(openMenu ?? false);
	const [query, setQuery] = useState("");

	const debouncedQuery = useDebounce(query, 500);

	const triggerOutline = button ? (
		button
	) : (
		<Button className="h-10 gap-1 rounded pb-5 pr-3 pt-5" variant="outline">
			<ListPlus size={18} />
			Add to List
		</Button>
	);

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
			<DialogTrigger asChild>{triggerOutline}</DialogTrigger>
			<DialogContent className="flex h-1/2 w-full max-w-none flex-col gap-0 p-0 sm:h-[80%] sm:max-h-[800px] sm:max-w-md sm:p-0">
				<div className="mb-4 flex items-center border-b pr-10">
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

				<MusicSearch
					query={debouncedQuery}
					category={category}
					listId={listId}
					onNavigate={() => {
						setQuery("");
						setOpen(false);
					}}
					onClick={onClick}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default SearchAddToList;
