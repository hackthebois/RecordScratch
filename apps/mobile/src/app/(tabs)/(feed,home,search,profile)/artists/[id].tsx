import { Artist } from "@recordscratch/lib";
import { FlashList } from "@shopify/flash-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import { ArtistItem } from "~/components/Item/ArtistItem";
import { ResourceItem } from "~/components/Item/ResourceItem";
import Metadata from "~/components/Metadata";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import SongTable from "~/components/SongTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { getQueryOptions } from "~/lib/deezer";

const ArtistMetadata = ({ artist }: { artist: Artist }) => {
	return (
		<View className="flex flex-row mt-4 justify-center">
			<Metadata title={artist.name} cover={artist.picture_big ?? ""}>
				<View className="flex flex-row items-center justify-center gap-3">
					<RatingInfo
						resource={{
							resourceId: String(artist.id),
							category: "ARTIST",
						}}
					/>
					{/*
				<AddToList
					resourceId={String(artist.id)}
					category="ARTIST"
				/> */}
				</View>
			</Metadata>
		</View>
	);
};

const ArtistPage = () => {
	const [value, setValue] = useState("artist");
	const { id } = useLocalSearchParams<{ id: string }>();
	const artistId = id!;

	const { data: artist } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}",
			input: {
				id: artistId,
			},
		})
	);
	const { data: top } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/top",
			input: {
				id: artistId,
			},
		})
	);
	const { data: albums } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/albums",
			input: {
				id: artistId,
				limit: 100,
			},
		})
	);
	const { data: artists } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/related",
			input: {
				id: artistId,
			},
		})
	);

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
			<View className="flex-1">
				<Stack.Screen options={{ title: artist.name }} />
				<ScrollView>
					<ArtistMetadata artist={artist} />
					<Tabs value={value} onValueChange={setValue} className="w-full flex-1">
						<View className="flex-1 px-4">
							<TabsList className="flex-row w-full">
								<TabsTrigger value="artist" className="flex-1">
									<Text>Artist</Text>
								</TabsTrigger>
								<TabsTrigger value="discography" className="flex-1">
									<Text>Discography</Text>
								</TabsTrigger>
							</TabsList>
						</View>
						<TabsContent value="artist" className="p-4 gap-4">
							<Text variant="h1">Top Songs</Text>
							<View>
								<SongTable songs={top.data} />
							</View>
							<Text variant="h1">Related Artists</Text>
							<FlashList
								data={artists.data}
								renderItem={({ item: artist }) => (
									<ArtistItem
										artistId={String(artist.id)}
										initialArtist={artist}
										direction="vertical"
										textCss="line-clamp-2 text-center w-32 -mt-2"
										imageWidthAndHeight={105}
									/>
								)}
								horizontal
								contentContainerClassName="gap-2 pb-4"
								estimatedItemSize={105}
							/>
						</TabsContent>
						<TabsContent value="discography" className="p-4">
							<FlashList
								data={albums.data}
								renderItem={({ item }) => (
									<ResourceItem
										direction="vertical"
										resource={{
											resourceId: String(item.id),
											category: "ALBUM",
											parentId: String(item.artist?.id),
										}}
										titleCss="w-40 truncate line-clamp-2"
									/>
								)}
								ItemSeparatorComponent={() => <View className="h-4" />}
								numColumns={2}
								estimatedItemSize={200}
							/>
						</TabsContent>
					</Tabs>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default ArtistPage;
