import { ProfileItem } from "@/components/ProfileItem";
import { ResourceItem } from "@/components/ResourceItem";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api } from "@/trpc/react";
import { deezer } from "@/utils/deezer";
import { useDebounce } from "@/utils/hooks";
import { useRecents } from "@/utils/recents";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { ArtistItem } from "./artist/ArtistItem";

const SearchState = ({
	isError,
	isLoading,
	noResults,
	children,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onNavigate,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	hide,
}: {
	isLoading: boolean;
	isError: boolean;
	noResults: boolean;
	onNavigate: () => void;
	children: React.ReactNode;
	hide?: {
		artists?: boolean;
		albums?: boolean;
		profiles?: boolean;
		songs?: boolean;
	};
}) => {
	const { recents, addRecent } = useRecents();

	if (isError) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">An error occurred</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader2 className="animate-spin" size={35} />
			</div>
		);
	}

	if (noResults) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">No results found</p>
			</div>
		);
	}

	return (
		<ScrollArea className="flex flex-col gap-3 px-4">
			<div className="flex flex-col gap-3 pb-4">
				{children ? (
					children
				) : (
					<>
						{recents.map((recent, index) =>
							recent.type === "ARTIST" && !hide?.artists ? (
								<ArtistItem
									onClick={() => {
										addRecent({
											id: String(recent.data.id),
											type: "ARTIST",
											data: recent.data,
										});
										onNavigate();
									}}
									artistId={String(recent.data.id)}
									initialArtist={recent.data}
									key={index}
								/>
							) : recent.type === "ALBUM" && !hide?.albums ? (
								<ResourceItem
									showType
									initialAlbum={recent.data}
									resource={{
										parentId: String(
											recent.data.artist?.id
										),
										resourceId: String(recent.data.id),
										category: "ALBUM",
									}}
									onClick={() => {
										addRecent({
											id: String(recent.data.id),
											type: "ALBUM",
											data: recent.data,
										});
										onNavigate();
									}}
									key={index}
								/>
							) : recent.type === "SONG" && !hide?.songs ? (
								<ResourceItem
									showType
									resource={{
										parentId: String(recent.data.album.id),
										resourceId: String(recent.data.id),
										category: "SONG",
									}}
									onClick={() => {
										addRecent({
											id: String(recent.data.id),
											type: "SONG",
											data: recent.data,
										});
										onNavigate();
									}}
									key={index}
								/>
							) : recent.type === "PROFILE" && !hide?.profiles ? (
								<ProfileItem
									profile={recent.data}
									onClick={() => {
										addRecent({
											id: recent.data.userId,
											type: "PROFILE",
											data: recent.data,
										});
										onNavigate();
									}}
									key={index}
								/>
							) : null
						)}
					</>
				)}
			</div>
		</ScrollArea>
	);
};

const ProfileSearch = ({
	query,
	onNavigate,
}: {
	query: string;
	onNavigate: () => void;
}) => {
	const { addRecent } = useRecents();

	const { data, isLoading, isError } = api.profiles.search.useQuery(query, {
		gcTime: 0,
		refetchOnMount: false,
		enabled: query.length > 0,
	});

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={data?.length === 0}
			hide={{ artists: true, albums: true, songs: true }}
		>
			{data && (
				<>
					{data.map((profile, index) => (
						<ProfileItem
							profile={profile}
							key={index}
							onClick={() => {
								addRecent({
									id: profile.userId,
									type: "PROFILE",
									data: profile,
								});
								onNavigate();
							}}
						/>
					))}
				</>
			)}
		</SearchState>
	);
};

const MusicSearch = ({
	query,
	onNavigate,
}: {
	query: string;
	onNavigate: () => void;
}) => {
	const { addRecent } = useRecents();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["search", "search-music", query],
		queryFn: async () => {
			const artists = await deezer({
				route: "/search/artist",
				input: { q: query, limit: 4 },
			});
			const albums = await deezer({
				route: "/search/album",
				input: { q: query, limit: 4 },
			});
			const songs = await deezer({
				route: "/search/track",
				input: { q: query, limit: 4 },
			});

			return {
				artists: artists.data,
				albums: albums.data,
				songs: songs.data,
			};
		},
		refetchOnMount: false,
		enabled: query.length > 0,
	});

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={data?.albums.length === 0 && data?.artists.length === 0}
			hide={{ profiles: true }}
		>
			{data && (
				<>
					{data.albums.length > 0 && (
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
					{data.artists.length > 0 && (
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
					{data.songs.length > 0 && (
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

const SearchBar = () => {
	const [tab, setTab] = useState<string>("music");
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
					<Search size={17} />
					Search
				</Button>
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
				<Tabs value={tab} onValueChange={setTab} className="p-4">
					<TabsList className="w-full">
						<TabsTrigger value="music" className="flex-1">
							Music
						</TabsTrigger>
						<TabsTrigger value="profiles" className="flex-1">
							Users
						</TabsTrigger>
					</TabsList>
				</Tabs>
				{tab === "music" ? (
					<MusicSearch
						query={debouncedQuery}
						onNavigate={() => {
							setQuery("");
							setOpen(false);
						}}
					/>
				) : (
					<ProfileSearch
						query={debouncedQuery}
						onNavigate={() => {
							setQuery("");
							setOpen(false);
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default SearchBar;
