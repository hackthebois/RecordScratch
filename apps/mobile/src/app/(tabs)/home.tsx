import Metadata from "~/components/Metadata";
import { formatDuration } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Alert, BackHandler, FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotFound from "../+not-found";
import { getQueryOptions } from "~/lib/deezer";
import { useRouter } from "expo-router";
import AlbumItem from "~/components/Item/AlbumItem";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const AlbumOfTheDay = () => {
	const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumOfTheDay.albumId },
		})
	);

	if (!album) return <NotFound />;
	const router = useRouter();

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
			<Button
				variant="secondary"
				className="w-1/3"
				onPress={() => {
					router.push(`/albums/${albumOfTheDay.albumId}`);
				}}
			>
				<Text>Go to Album</Text>
			</Button>
		</Metadata>
	);
};

const HomePage = () => {
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
			<ScrollView
				contentContainerClassName="flex flex-col gap-3"
				nestedScrollEnabled
				style={{ flex: 1 }}
			>
				<AlbumOfTheDay />
				<View className="flex flex-col gap-2">
					<Text variant="h1" className="px-4">
						Trending
					</Text>
					<FlatList
						data={trending}
						renderItem={({ item }) => <AlbumItem {...item} className="p-4" />}
						horizontal
						contentContainerClassName="gap-4 px-4 pb-4"
					/>
				</View>
				<View className="flex flex-col gap-2">
					<Text variant="h1" className="py-2 px-4">
						Top Albums
					</Text>
					<FlatList
						data={top}
						renderItem={({ item }) => <AlbumItem {...item} className="p-4" />}
						horizontal
						contentContainerClassName="gap-4 px-4 pb-4"
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomePage;
