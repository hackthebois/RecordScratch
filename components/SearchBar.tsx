"use client";

import { searchMusicAction, searchProfilesAction } from "@/app/_api/actions";
import { Artist } from "@/app/_api/spotify";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useDebounce } from "@/utils/hooks";
import { useRecents } from "@/utils/recents";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProfileItem } from "./ProfileItem";
import { AlbumItem } from "./resource/album/AlbumItem";
import { Button } from "./ui/Button";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";

const ArtistItem = ({
	artist,
	onClick,
}: {
	artist: Artist;
	onClick: () => void;
}) => {
	const artistImage = artist.images?.find((i) => i.url);

	return (
		<Link
			href={`/artists/${artist.id}`}
			onClick={onClick}
			className="flex w-full min-w-0 flex-row items-center gap-4 rounded"
			prefetch={false}
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

const SearchState = ({
	isError,
	isLoading,
	noResults,
	children,
	onNavigate,
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
											id: recent.data.id,
											type: "ARTIST",
											data: recent.data,
										});
										onNavigate();
									}}
									artist={recent.data}
									key={index}
								/>
							) : recent.type === "ALBUM" && !hide?.albums ? (
								<AlbumItem
									album={recent.data}
									name={recent.data.name}
									category="ALBUM"
									onClick={() => {
										addRecent({
											id: recent.data.id,
											type: "ALBUM",
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

	const { data, isLoading, isError } = useQuery({
		queryKey: ["search", "search-profiles", query],
		queryFn: async () => {
			const { data, serverError } = await searchProfilesAction(query);
			if (serverError) throw new Error(serverError);
			return data;
		},
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
			hide={{ artists: true, albums: true }}
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
			const { data, serverError } = await searchMusicAction(query);
			if (serverError) throw new Error(serverError);
			return data;
		},
		refetchOnMount: false,
		enabled: query.length > 0,
	});

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={
				data?.albums.items.length === 0 &&
				data?.artists.items.length === 0
			}
			hide={{ profiles: true }}
		>
			{data && (
				<>
					<h4>Albums</h4>
					{data.albums.items.map((album, index) => (
						<AlbumItem
							album={album}
							name={album.name}
							category="ALBUM"
							onClick={() => {
								addRecent({
									id: album.id,
									type: "ALBUM",
									data: album,
								});
								onNavigate();
							}}
							key={index}
						/>
					))}
					<h4 className="mt-3">Artists</h4>
					{data.artists.items.map((artist, index) => (
						<ArtistItem
							onClick={() => {
								addRecent({
									id: artist.id,
									type: "ARTIST",
									data: artist,
								});
								onNavigate();
							}}
							artist={artist}
							key={index}
						/>
					))}
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
