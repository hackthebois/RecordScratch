import { SearchOptions, useDebounce } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Platform, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArtistItem } from "~/components/Item/ArtistItem";
import { ProfileItem } from "~/components/Item/ProfileItem";
import { ResourceItem } from "~/components/Item/ResourceItem";
// import { useRecents } from "~/components/recents";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { deezerHelpers } from "~/lib/deezer";
import { Search } from "~/lib/icons/Search";

export default function SearchPage() {
	// const { addRecent } = useRecents("SEARCH");
	const [tab, setTab] = useState("top");
	const [query, setQuery] = useState("");
	const [options, setOptions] = useState<Omit<SearchOptions, "query">>({
		filters: { albums: true, artists: true, songs: true },
		limit: 6,
	});
	const debouncedQuery = useDebounce(query, 500);

	const { data: music, isLoading } = useQuery({
		queryKey: ["search", debouncedQuery, options],
		queryFn: async () => {
			return await deezerHelpers.search({ query: debouncedQuery, ...options });
		},
		enabled: debouncedQuery.length > 0 && tab !== "profiles",
	});

	const { data: profiles, isLoading: isLoadingProfiles } = api.profiles.search.useQuery(query, {
		gcTime: 0,
		refetchOnMount: false,
		enabled: debouncedQuery.length > 0 && tab === "profiles",
	});

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right", "top"]}>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<View className="flex-row w-full items-center pr-4 h-14">
				<Search size={20} className="mx-4 text-foreground" />
				<TextInput
					id="name"
					autoComplete="off"
					placeholder="Search"
					value={query}
					cursorColor={"#ffb703"}
					style={{
						paddingTop: 0,
						paddingBottom: Platform.OS === "ios" ? 4 : 0,
						textAlignVertical: "center",
					}}
					autoFocus
					className="flex-1 h-full text-lg text-foreground outline-none p-0"
					onChangeText={(text) => setQuery(text)}
				/>
			</View>
			<Tabs value={tab} onValueChange={setTab}>
				<View className="px-4">
					<TabsList className="flex-row">
						<TabsTrigger
							value="top"
							onPress={() =>
								setOptions({
									filters: { albums: true, artists: true, songs: true },
								})
							}
						>
							<Text>Top</Text>
						</TabsTrigger>
						<TabsTrigger value="profiles" className="flex-1">
							<Text>Profiles</Text>
						</TabsTrigger>
						<TabsTrigger
							value="albums"
							className="flex-1"
							onPress={() =>
								setOptions({
									filters: { albums: true, artists: false, songs: false },
									limit: 12,
								})
							}
						>
							<Text>Albums</Text>
						</TabsTrigger>
						<TabsTrigger
							value="artists"
							className="flex-1"
							onPress={() =>
								setOptions({
									filters: { albums: false, artists: true, songs: false },
									limit: 12,
								})
							}
						>
							<Text>Artists</Text>
						</TabsTrigger>
						<TabsTrigger
							value="songs"
							className="flex-1"
							onPress={() =>
								setOptions({
									filters: { albums: false, artists: false, songs: true },
									limit: 12,
								})
							}
						>
							<Text>Songs</Text>
						</TabsTrigger>
					</TabsList>
				</View>
			</Tabs>
			{isLoading || isLoadingProfiles ? (
				<View className="flex items-center justify-center flex-1">
					<ActivityIndicator size="large" color="#ff8500" />
				</View>
			) : null}
			<ScrollView
				contentContainerClassName="p-4 gap-2"
				automaticallyAdjustKeyboardInsets
				keyboardShouldPersistTaps="handled"
			>
				{tab === "profiles" ? (
					profiles?.map((profile, index) => (
						<ProfileItem
							profile={profile}
							key={index}
							onClick={() => {
								// addRecent({
								// 	id: profile.userId,
								// 	type: "PROFILE",
								// 	data: profile,
								// });
							}}
							isUser
						/>
					))
				) : (
					<>
						{music?.songs.map((song) => (
							<ResourceItem
								key={song.id}
								resource={{
									parentId: String(song.album.id),
									resourceId: String(song.id),
									category: "SONG" as const,
								}}
								onPress={() => {
									// addRecent({
									// 	id: String(song.id),
									// 	type: "SONG",
									// 	data: song,
									// });
								}}
								imageWidthAndHeight={80}
								showType
							/>
						))}
						{music?.albums.map((album) => (
							<ResourceItem
								key={album.id}
								resource={{
									parentId: String(album.artist?.id),
									resourceId: String(album.id),
									category: "ALBUM" as const,
								}}
								onPress={() => {
									// addRecent({
									// 	id: String(album.id),
									// 	type: "ALBUM",
									// 	data: album,
									// });
								}}
								imageWidthAndHeight={80}
								showType
							/>
						))}
						{music?.artists.map((artist) => (
							<ArtistItem
								key={artist.id}
								artistId={String(artist.id)}
								initialArtist={artist}
								onClick={() => {
									// addRecent({
									// 	id: String(artist.id),
									// 	type: "ARTIST",
									// 	data: artist,
									// });
								}}
								imageWidthAndHeight={80}
								showType
							/>
						))}
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
