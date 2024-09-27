import { formatDuration } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlbumItem from "~/components/Item/AlbumItem";
import Metadata from "~/components/Metadata";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";
import NotFound from "../+not-found";

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
					router.navigate(`/albums/${albumOfTheDay.albumId}`);
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
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
			<ScrollView
				contentContainerClassName="flex flex-col gap-6"
				nestedScrollEnabled
				style={{ flex: 1 }}
			>
				<AlbumOfTheDay />
				<Text variant="h2" className="px-4">
					Trending
				</Text>
				<FlatList
					data={trending}
					renderItem={({ item }) => <AlbumItem {...item} />}
					horizontal
					contentContainerClassName="px-4 gap-3 pb-4"
				/>
				<Text variant="h2" className="py-2 px-4">
					Top Albums
				</Text>
				<FlatList
					data={top}
					renderItem={({ item }) => <AlbumItem {...item} />}
					horizontal
					contentContainerClassName="px-4 gap-3 pb-4"
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomePage;
