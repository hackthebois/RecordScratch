import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { useDebounce } from "@/utils/hooks";
import { Button } from "../ui/Button";
import { Search } from "lucide-react";
import { ResourceItem } from "../ResourceItem";
import { useRecents } from "@/utils/recents";
import { useQuery } from "@tanstack/react-query";
import { deezer } from "@/utils/deezer";
import { SearchState } from "../SearchBar";
import { ArtistItem } from "../artist/ArtistItem";

export const MusicSearch = ({
	query,
	onNavigate,
	category,
}: {
	query: string;
	category: "ALBUM" | "SONG" | "ARTIST";
	onNavigate: () => void;
}) => {
	const { addRecent } = useRecents("LISTADD")();

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

	return (
		<SearchState
			type={"LISTADD"}
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={data?.albums === null && data?.artists === null}
			hide={{ profiles: true }}
		>
			{data && (
				<>
					{data.albums && (
						<>
							<h4>Albums</h4>
							{data.albums.map((album, index) => (
								<ResourceItem
									initialAlbum={album}
									resource={{
										parentId: String(album.artist?.id),
										resourceId: String(album.id),
										category: "ALBUM",
									}}
									onClick={() => {
										addRecent({
											id: String(album.id),
											type: "ALBUM",
											data: album,
										});
										onNavigate();
									}}
									key={index}
								/>
							))}
						</>
					)}
					{data.artists && (
						<>
							<h4 className="mt-3">Artists</h4>
							{data.artists.map((artist, index) => (
								<ArtistItem
									onClick={() => {
										addRecent({
											id: String(artist.id),
											type: "ARTIST",
											data: artist,
										});
										onNavigate();
									}}
									artistId={String(artist.id)}
									initialArtist={artist}
									key={index}
								/>
							))}
						</>
					)}
					{data.songs && (
						<>
							<h4 className="mt-3">Songs</h4>
							{data.songs.map((song, index) => (
								<ResourceItem
									resource={{
										parentId: String(song.album.id),
										resourceId: String(song.id),
										category: "SONG",
									}}
									onClick={() => {
										addRecent({
											id: String(song.id),
											type: "SONG",
											data: song,
										});
										onNavigate();
									}}
									key={index}
								/>
							))}
						</>
					)}
				</>
			)}
		</SearchState>
	);
};

export const ListItemAdd = ({
	category,
}: {
	category: "ALBUM" | "SONG" | "ARTIST";
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
				<Button variant="outline" className="gap-3">
					Add Item
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
					onNavigate={() => {
						setQuery("");
						setOpen(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ListItemAdd;
