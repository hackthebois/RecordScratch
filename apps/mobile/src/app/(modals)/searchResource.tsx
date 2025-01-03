import { Album, Artist, cn, Track, useDebounce } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Platform, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
// import { useRecents } from "@/components/recents";
import { deezerHelpers } from "@/lib/deezer";
import { Search } from "@/lib/icons/IconsLoader";
import { ArrowLeft } from "@/lib/icons/IconsLoader";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { FlashList } from "@shopify/flash-list";

const MusicSearch = ({
	query,
	category,
	listId,
	onPress,
}: {
	query: string;
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
	onPress?: () => void;
}) => {
	const options = {
		filters: {
			albums: category === "ALBUM",
			artists: category === "ARTIST",
			songs: category === "SONG",
		},
		limit: 8,
	};
	const debouncedQuery = useDebounce(query, 500);

	const { data: music, isLoading } = useQuery({
		queryKey: ["search", debouncedQuery, options],
		queryFn: async () => {
			return await deezerHelpers.search({ query: debouncedQuery, ...options });
		},
		enabled: debouncedQuery.length > 0,
	});

	const list = api.useUtils().lists.resources.get;
	const { mutate } = api.lists.resources.create.useMutation({
		onSettled: async (_data, _error, variables) => {
			if (variables) {
				await list.invalidate({
					listId: variables.listId,
				});
				if (onPress) onPress();
			}
		},
	});

	if (isLoading) {
		return (
			<View className="flex items-center justify-center flex-1">
				<ActivityIndicator size="large" color="#ff8500" />
			</View>
		);
	}

	const renderItem = ({ item }: { item: Artist | Album | Track }) => {
		switch (category) {
			case "SONG":
				const song = item as Track;
				return (
					<ResourceItem
						key={song.id}
						resource={{
							parentId: String(song.album.id),
							resourceId: String(song.id),
							category: "SONG",
						}}
						onPress={() => {
							mutate({
								resourceId: String(song.id),
								parentId: String(song.album.id),
								listId,
							});
						}}
						showLink={false}
						imageWidthAndHeight={100}
						className="my-2"
					/>
				);
			case "ALBUM":
				const album = item as Album;
				return (
					<ResourceItem
						key={album.id}
						resource={{
							parentId: String(album.artist?.id),
							resourceId: String(album.id),
							category: "ALBUM",
						}}
						onPress={() => {
							mutate({
								resourceId: String(album.id),
								parentId: String(album.artist?.id),
								listId,
							});
						}}
						showLink={false}
						imageWidthAndHeight={100}
						className="my-2"
					/>
				);
			case "ARTIST":
				const artist = item as Artist;
				return (
					<ArtistItem
						key={artist.id}
						artistId={String(artist.id)}
						onPress={() => {
							mutate({
								resourceId: String(artist.id),
								listId,
							});
						}}
						showLink={false}
						imageWidthAndHeight={100}
						className="my-2"
					/>
				);
		}
	};

	return (
		<FlashList
			data={
				category === "SONG"
					? music?.songs
					: category === "ALBUM"
						? music?.albums
						: music?.artists
			}
			renderItem={renderItem}
			keyExtractor={(item) => item.id.toString()}
			contentContainerStyle={{ padding: 16 }}
			keyboardShouldPersistTaps="handled"
			estimatedItemSize={100}
		/>
	);
};

const SearchAddModal = () => {
	const router = useRouter();
	const { category, listId } = useLocalSearchParams<{
		category: "ALBUM" | "SONG" | "ARTIST";
		listId: string;
	}>();
	const [query, setQuery] = useState("");
	const utils = api.useUtils();
	const myProfile = useAuth((s) => s.profile);

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right", "top"]}>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<View className="flex-row w-full items-center pt-4">
				<ArrowLeft
					size={26}
					onPress={() => {
						router.back();
					}}
					className="ml-2 mx-2 text-foreground"
				/>
				<View className="flex-row w-full items-center pr-4 h-14 border border-border rounded-xl">
					<Search size={20} className="mx-4 text-foreground" />
					<TextInput
						id="name"
						autoComplete="off"
						placeholder={cn("Search for a", category.toLowerCase())}
						value={query}
						cursorColor={"#ffb703"}
						style={{
							paddingTop: 0,
							paddingBottom: Platform.OS === "ios" ? 4 : 0,
							textAlignVertical: "center",
						}}
						autoCorrect={false}
						autoFocus
						className="flex-1 h-full text-xl text-foreground outline-none p-0 w-full"
						onChangeText={(text) => setQuery(text)}
					/>
				</View>
			</View>
			<MusicSearch
				query={query}
				category={category}
				listId={listId!}
				onPress={() => {
					utils.lists.topLists.invalidate({
						userId: myProfile!.userId,
					});
					utils.lists.getUser.invalidate({ userId: myProfile!.userId });
					router.back();
				}}
			/>
		</SafeAreaView>
	);
};
export default SearchAddModal;
