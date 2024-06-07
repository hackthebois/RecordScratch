import { ArtistItem } from "./ArtistItem";
import { ResourceItem } from "./ResourceItem";
import { deezer } from "../utils/deezer";
import { useRecents } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native-ui-lib";
import SearchState from "./SearchState";

export const MusicSearch = ({
	query,
	onNavigate,
	hide,
}: {
	query: string;
	onNavigate: () => void;
	hide?: { artists?: boolean; albums?: boolean; songs?: boolean };
}) => {
	const { addRecent } = useRecents("SEARCH");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["search", "search-music", query],
		queryFn: async () => {
			const artists = await deezer({
				route: "/search/artist",
				input: { q: query, limit: 10 },
			});
			const albums = await deezer({
				route: "/search/album",
				input: { q: query, limit: 10 },
			});
			const songs = await deezer({
				route: "/search/track",
				input: { q: query, limit: 10 },
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
	const ImageCss = "h-20 w-20 mb-2";

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={data?.albums.length === 0 && data?.artists.length === 0}
			hide={{ profile: true } && hide}
		>
			{data && (
				<>
					{data.albums.length > 0 && (
						<>
							{data.albums.map((album, index) => (
								<View className=" border-b border-gray-400" key={index}>
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
										imageCss={ImageCss}
										showType={true}
									/>
								</View>
							))}
						</>
					)}
					{data.artists.length > 0 && (
						<>
							{data.artists.map((artist, index) => (
								<View className="border-b border-gray-400" key={index}>
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
										imageCss={ImageCss}
									/>
								</View>
							))}
						</>
					)}
					{data.songs.length > 0 && (
						<>
							{data.songs.map((song, index) => (
								<View className="border-b border-gray-400" key={index}>
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
										imageCss={ImageCss}
										showType={true}
									/>
								</View>
							))}
						</>
					)}
				</>
			)}
		</SearchState>
	);
};

export default MusicSearch;
