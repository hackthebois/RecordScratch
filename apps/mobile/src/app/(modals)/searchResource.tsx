import { useDebounce } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Platform, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArtistItem } from "~/components/Item/ArtistItem";
import { ResourceItem } from "~/components/Item/ResourceItem";
// import { useRecents } from "~/components/recents";
import { deezerHelpers } from "~/lib/deezer";
import { Search } from "~/lib/icons/Search";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";

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
	// const { addRecent } = useRecents("SEARCH");
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

	return (
		<>
			{isLoading ? (
				<View className="flex items-center justify-center flex-1">
					<ActivityIndicator size="large" color="#ff8500" />
				</View>
			) : null}
			<ScrollView
				contentContainerClassName="p-4 gap-2"
				automaticallyAdjustKeyboardInsets
				keyboardShouldPersistTaps="handled"
			>
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
								mutate({
									resourceId: String(artist.id),
									listId,
								});
							}}
							showLink={false}
							imageWidthAndHeight={100}
							className="my-2"
						/>
					))}
				</>
			</ScrollView>
		</>
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
					header: () => (
						<View className="flex-row w-full items-center pt-4">
							<ArrowLeft
								size={26}
								onPress={() => {
									router.back();
								}}
								className="ml-4 mx-4 text-foreground"
							/>
							<View className="flex-row w-96 items-center pr-4 border border-muted rounded-md bg-gray-100">
								<Search size={20} className="ml-1 mr-2 text-foreground" />
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
						</View>
					),
				}}
			/>

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
