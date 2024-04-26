import { Button } from "@/components/Button";
import Metadata from "@/components/Metadata";
import { ResourceItem } from "@/components/ResourceItem";
import { Text } from "@/components/Text";
import { api } from "@/components/TrpcProvider";
import { Album, formatDuration, getQueryOptions } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AlbumItem = ({ album }: { album: Album }) => {
	return (
		<View>
			<Image source={album.cover_big} className="w-16 h-16" />
		</View>
	);
};

const Index = () => {
	const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumOfTheDay?.albumId! },
		})
	);
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();

	const { setColorScheme, colorScheme } = useColorScheme();

	return (
		<SafeAreaView edges={["top", "left", "right"]}>
			<ScrollView contentContainerClassName="flex flex-col gap-8 flex-1" nestedScrollEnabled>
				<Metadata
					title={album.title}
					cover={album.cover_big}
					type="ALBUM OF THE DAY"
					tags={[
						album.release_date,
						album.duration ? `${formatDuration(album.duration)}` : undefined,
						...(album.genres?.data.map((genre) => genre.name) ?? []),
					]}
				>
					<></>
				</Metadata>
				<Text variant="h1" className="px-4 mt-4">
					Trending
				</Text>
				<FlatList
					data={trending}
					renderItem={({ item }) => (
						<ResourceItem
							direction="vertical"
							resource={{
								resourceId: item.resourceId,
								category: "ALBUM",
								parentId: "",
							}}
						/>
					)}
					horizontal
					contentContainerClassName="gap-4 px-4 pb-4"
				/>
				<Text variant="h1" className="px-4">
					Top Albums
				</Text>
				<FlatList
					data={top}
					renderItem={({ item }) => (
						<ResourceItem
							direction="vertical"
							resource={{
								resourceId: item.resourceId,
								category: "ALBUM",
								parentId: "",
							}}
						/>
					)}
					horizontal
					contentContainerClassName="gap-4 px-4 pb-4"
				/>
				<Button
					label="Toggle mode"
					variant="secondary"
					onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Index;
