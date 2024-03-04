import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { useDebounce } from "@/utils/hooks";
import { Button } from "../ui/Button";
import { PlusSquare, Search } from "lucide-react";
import { ResourceItem } from "../ResourceItem";
import { useQuery } from "@tanstack/react-query";
import { deezer } from "@/utils/deezer";
import { ArtistItem } from "../artist/ArtistItem";
import { AddListItemButton } from "./ModifyListItemButton";
import { ScrollArea } from "../ui/ScrollArea";

export const MusicSearch = ({
	query,
	category,
	listId,
}: {
	query: string;
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
	onNavigate: () => void;
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

	return (
		<ScrollArea className="flex flex-col gap-3 px-4">
			<div className="flex flex-col gap-3 pb-4">
				{data && (
					<>
						{data.albums && (
							<>
								<h4>Albums</h4>
								{data.albums.map((album, index) => (
									<div className="flex flex-row justify-between">
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
										/>

										<AddListItemButton
											parentId={String(album.artist?.id)}
											resourceId={String(album.id)}
											listId={listId}
										/>
									</div>
								))}
							</>
						)}
						{data.artists && (
							<>
								<h4 className="mt-3">Artists</h4>
								{data.artists.map((artist, index) => (
									<div className="flex flex-row justify-between">
										<ArtistItem
											artistId={String(artist.id)}
											initialArtist={artist}
											key={index}
										/>

										<AddListItemButton
											resourceId={String(artist.id)}
											listId={listId}
										/>
									</div>
								))}
							</>
						)}
						{data.songs && (
							<>
								<h4 className="mt-3">Songs</h4>
								{data.songs.map((song, index) => (
									<div className="flex flex-row justify-between">
										<ResourceItem
											resource={{
												parentId: String(song.album.id),
												resourceId: String(song.id),
												category: "SONG",
											}}
											key={index}
										/>

										<AddListItemButton
											parentId={String(song.album.id)}
											resourceId={String(song.id)}
											listId={listId}
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

export const AddToList = ({
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
				<Button className="items-center gap-1 rounded pl-1 pr-2">
					<PlusSquare className="h-6 w-6" />
					Add to List
				</Button>
			</DialogTrigger>
			<DialogContent className="flex h-full w-full max-w-none flex-col gap-0 p-0 sm:h-[80%] sm:max-h-[800px] sm:max-w-md sm:p-0">
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
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddToList;
