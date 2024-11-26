import { ArtistItem } from "@/components/Item/ArtistItem";
import { ProfileItem } from "@/components/Item/ProfileItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { useDebounce } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Platform, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useRecents } from "@/components/recents";
import { KeyboardAvoidingScrollView } from "@/components/KeyboardAvoidingView";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { deezerHelpers } from "@/lib/deezer";
import { Search } from "@/lib/icons/Search";

const tabs = {
	all: {
		label: "All",
		value: "all",
		filters: { albums: true, artists: true, songs: true },
		limit: 4,
	},
	songs: {
		label: "Songs",
		value: "songs",
		filters: { albums: false, artists: false, songs: true },
		limit: 12,
	},
	albums: {
		label: "Albums",
		value: "albums",
		filters: { albums: true, artists: false, songs: false },
		limit: 12,
	},
	artists: {
		label: "Artists",
		value: "artists",
		filters: { albums: false, artists: true, songs: false },
		limit: 12,
	},
	profiles: {
		label: "Profiles",
		value: "profiles",
		filters: { albums: false, artists: false, songs: false },
		limit: 12,
	},
};
export default function SearchPage() {
	// const { addRecent } = useRecents("SEARCH");
	const [tab, setTab] = useState<keyof typeof tabs>("all");
	const [query, setQuery] = useState("");

	const debouncedQuery = useDebounce(query, 500);

	const { data: music, isLoading } = useQuery({
		queryKey: ["search", debouncedQuery, tabs[tab]],
		queryFn: async () => {
			return await deezerHelpers.search({ query: debouncedQuery, ...tabs[tab] });
		},
		enabled: debouncedQuery.length > 0 && ["all", "songs", "albums", "artists"].includes(tab),
	});

	const { data: profiles, isLoading: isLoadingProfiles } = api.profiles.search.useQuery(
		{ query: debouncedQuery, ...tabs[tab] },
		{
			gcTime: 0,
			refetchOnMount: false,
			enabled: debouncedQuery.length > 0 && ["profiles", "all"].includes(tab),
		}
	);

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right", "top"]}>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<View className="px-4 gap-2">
				<View className="flex-row w-full items-center pr-4 h-14 border border-border rounded-xl">
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
						autoCorrect={false}
						autoFocus
						className="flex-1 h-full text-xl text-foreground outline-none p-0"
						onChangeText={(text) => setQuery(text)}
					/>
				</View>
				<Tabs
					value={tab}
					onValueChange={(value) =>
						value !== tab ? setTab(value as keyof typeof tabs) : setTab("all")
					}
				>
					<TabsList className="flex-row">
						{Object.entries(tabs)
							.filter(([key]) => key !== "all")
							.map(([key, tab]) => (
								<TabsTrigger key={key} value={key} className="flex-1">
									<Text>{tab.label}</Text>
								</TabsTrigger>
							))}
					</TabsList>
				</Tabs>
			</View>
			<KeyboardAvoidingScrollView contentContainerClassName="p-4 gap-3">
				{isLoading || isLoadingProfiles ? (
					<View className="flex items-center justify-center pt-40">
						<ActivityIndicator size="large" color="#ff8500" />
					</View>
				) : (
					<>
						{tab !== "profiles"
							? music?.songs.map((song) => (
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
								))
							: null}
						{tab !== "profiles"
							? music?.albums.map((album) => (
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
								))
							: null}
						{tab !== "profiles"
							? music?.artists.map((artist) => (
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
								))
							: null}
						{tab === "profiles" || tab === "all"
							? profiles?.items.map((profile, index) => (
									<ProfileItem
										profile={profile}
										key={index}
										size={80}
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
							: null}
					</>
				)}
			</KeyboardAvoidingScrollView>
		</SafeAreaView>
	);
}
