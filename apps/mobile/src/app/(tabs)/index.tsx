import { Button } from "@/components/Button";
import Metadata from "@/components/Metadata";
import { ResourceItem } from "@/components/ResourceItem";
import { api, getBaseUrl } from "@/utils/api";
import { Album, formatDuration } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { getQueryOptions } from "@/utils/deezer";

const AlbumOfTheDay = () => {
	const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumOfTheDay.albumId },
		})
	);

	return (
		<Metadata
			title={album.title}
			cover={album.cover_big}
			type="ALBUM OF THE DAY"
			tags={[
				album.release_date,
				album.duration ? `${formatDuration(album.duration)}` : undefined,
				...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
			]}
		>
			<></>
		</Metadata>
	);
};

const Index = () => {
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();

	const { setColorScheme, colorScheme } = useColorScheme();

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
			edges={["top", "left", "right"]}
		>
			<ScrollView
				contentContainerClassName="flex flex-col gap-6 flex-1 mt-10"
				nestedScrollEnabled
			>
				<AlbumOfTheDay />
				<div className="flex flex-col gap-2">
					<Text variant="h1" className="dark:text-white px-4 mt-4">
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
				</div>
				<div className="flex flex-col gap-2">
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
				</div>

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
