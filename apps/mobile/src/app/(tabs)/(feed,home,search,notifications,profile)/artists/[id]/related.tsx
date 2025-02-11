import { ArtistItem } from "@/components/Item/ArtistItem";
import { getQueryOptions } from "@/lib/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

const RelatedPage = () => {
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
	const { data: artists } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/related",
			input: {
				id: artistId,
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
					title: `Related Artists to ${artist.name}`,
				}}
			/>
			{Platform.OS === "web" && (
				<Text variant="h3" className="pb-4 text-center">
					Related Artists to {artist.name}'s
				</Text>
			)}
			<FlatList
				data={artists.data}
				renderItem={({ item }) => (
					<ArtistItem
						artistId={String(item.id)}
						initialArtist={item}
						direction="vertical"
						imageWidthAndHeight={115}
						className="max-w-32"
						textCss="line-clamp-2"
					/>
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

export default RelatedPage;
