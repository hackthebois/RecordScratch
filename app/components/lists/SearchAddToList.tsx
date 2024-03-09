import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { useDebounce } from "@/utils/hooks";
import { Button } from "../ui/Button";
import { ListPlus, PlusSquare, Search } from "lucide-react";
import { ResourceItem } from "../ResourceItem";
import { useQuery } from "@tanstack/react-query";
import { deezer } from "@/utils/deezer";
import { ArtistItem } from "../artist/ArtistItem";
import { ScrollArea } from "../ui/ScrollArea";
import { api } from "@/trpc/react";

export const MusicSearch = ({
	query,
	category,
	listId,
	setOpen,
}: {
	query: string;
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
	onNavigate: () => void;
	// eslint-disable-next-line no-unused-vars
	setOpen: (open: boolean) => void;
}) => {
	const { data } = useQuery({
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

	const list = api.useUtils().lists.resources.getListResources;
	const { mutate } = api.lists.resources.createListResource.useMutation({
		onSettled: (_data, _error, variables) => {
			if (variables) {
				list.invalidate({
					listId: variables.listId,
				});
			}
		},
	});

	return (
		<ScrollArea className="flex flex-col gap-3 px-4">
			<div className="flex flex-col gap-3 pb-4">
				{data && (
					<>
						{data.albums && (
							<>
								<h4>Albums</h4>
								{data.albums.map((album, index) => (
									<div
										className="flex flex-col gap-3"
										key={String(album.id)}
									>
										<ResourceItem
											initialAlbum={album}
											resource={{
												parentId: String(
													album.artist?.id
												),
												resourceId: String(album.id),
												category: "ALBUM",
											}}
											key={index}
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
												setOpen(false);
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
									<div className="flex flex-col gap-3">
										<ArtistItem
											artistId={String(artist.id)}
											initialArtist={artist}
											key={index}
											onClick={() => {
												mutate({
													resourceId: String(
														artist.id
													),
													listId,
												});
												list.invalidate({ listId });
												setOpen(false);
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
									<div className="flex flex-col gap-3">
										<ResourceItem
											resource={{
												parentId: String(song.album.id),
												resourceId: String(song.id),
												category: "SONG",
											}}
											key={index}
											onClick={() => {
												mutate({
													resourceId: String(song.id),
													parentId: String(
														song.album.id
													),
													listId,
												});
												list.invalidate({ listId });
												setOpen(false);
											}}
										/>
									</div>
								))}
							</>
						)}
					</>
				)}
			</div>
		</ScrollArea>
	);
};

export const SearchAddToList = ({
	category,
	listId,
}: {
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
}) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const debouncedQuery = useDebounce(query, 500);

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
			<DialogTrigger asChild>
				<Button
					className="h-16 w-full gap-1 rounded pb-5 pl-5 pr-3 pt-5"
					variant="outline"
				>
					<ListPlus className="h-6 w-6" />
					Add to List
				</Button>
			</DialogTrigger>
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
					setOpen={setOpen}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default SearchAddToList;
