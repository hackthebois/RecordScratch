import AlbumItem from "@/components/Item/AlbumItem";
import { getQueryOptions } from "@/lib/deezer";
import { FlashList } from "@shopify/flash-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Platform, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebWrapper } from "@/components/WebWrapper";

const DiscographyPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const artistId = id!;

	const { data: artist } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}",
			input: {
				id: artistId,
			},
		}),
	);

	const { data: albums } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/albums",
			input: {
				id: artistId,
				limit: 100,
			},
		}),
	);

	return (
		<SafeAreaView
			style={{ flex: 1 }}
			edges={["left", "right"]}
			className="flex flex-1 items-center"
		>
			<Stack.Screen
				options={{
					title: `${artist.name}'s Discography`,
				}}
			/>
			{Platform.OS === "web" && (
				<Text variant="h3" className="pb-4 text-center">
					{artist.name}'s Discography
				</Text>
			)}
			<FlatList
				data={albums.data}
				renderItem={({ item }) => (
					<AlbumItem resourceId={String(item.id)} />
				)}
				columnWrapperStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginVertical: 10,
					gap: 20,
					marginLeft: 5,
				}}
				keyboardShouldPersistTaps="always"
				keyboardDismissMode="interactive"
				numColumns={Platform.OS === "web" ? 3 : 2}
				scrollEnabled={true}
				horizontal={false}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
};

export default DiscographyPage;
