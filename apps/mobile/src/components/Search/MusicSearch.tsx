import { ArtistItem } from "#/components/Item/ArtistItem";
import { ResourceItem } from "#/components/Item/ResourceItem";
import { deezer } from "#/utils/deezer";
import { Album, Artist, Track } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native-ui-lib";
import SearchState from "./SearchState";
import React from "react";
import { useRecents } from "&/recents";

const SearchResults = ({ children }: { children: React.ReactNode }) => {
	return <View className=" border-b border-gray-400 p-1">{children}</View>;
};

export const MusicSearch = ({
	query,
	onNavigate,
	hide,
}: {
	query: string;
	onNavigate: () => void;
	hide?: { artists?: boolean; albums?: boolean; songs?: boolean };
}) => {
	const recentStore = useRecents("SEARCH");
	const { addRecent } = recentStore();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["search", query, hide],
		queryFn: async () => {
			const results = {
				artists: [] as Artist[],
				albums: [] as Album[],
				songs: [] as Track[],
			};

			const promises = [];

			if (!hide?.artists) {
				promises.push(
					deezer({
						route: "/search/artist",
						input: { q: query, limit: 6 },
					}).then((response) => {
						results.artists = response.data;
					})
				);
			}

			if (!hide?.albums) {
				promises.push(
					deezer({
						route: "/search/album",
						input: { q: query, limit: 6 },
					}).then((response) => {
						results.albums = response.data;
					})
				);
			}

			if (!hide?.songs) {
				promises.push(
					deezer({
						route: "/search/track",
						input: { q: query, limit: 6 },
					}).then((response) => {
						results.songs = response.data;
					})
				);
			}

			await Promise.all(promises);
			return results;
		},
		refetchOnMount: false,
		enabled: query.length > 0,
	});

	const imageWidthAndHeight = 100;

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={
				data?.albums.length === 0 && data?.artists.length === 0 && data?.songs.length === 0
			}
			hide={{ profiles: true, ...hide }}
		>
			{data && (
				<>
					{data.albums.map((album, index) => (
						<SearchResults key={index}>
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
								showType={true}
								imageWidthAndHeight={imageWidthAndHeight}
							/>
						</SearchResults>
					))}

					{data.artists.map((artist, index) => (
						<SearchResults key={index}>
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
								imageWidthAndHeight={imageWidthAndHeight}
								showType={true}
							/>
						</SearchResults>
					))}
					{data.songs.map((song, index) => (
						<SearchResults key={index}>
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
								showType={true}
								imageWidthAndHeight={imageWidthAndHeight}
							/>
						</SearchResults>
					))}
				</>
			)}
		</SearchState>
	);
};

export default MusicSearch;
