import { formatDuration } from "@recordscratch/lib";
import { FlashList } from "@shopify/flash-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlbumItem from "~/components/Item/AlbumItem";
import { ResourceItemSkeleton } from "~/components/Item/ResourceItem";
import Metadata from "~/components/Metadata";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";
import NotFound from "../../+not-found";

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
	const { data: trending } = api.ratings.trending.useQuery();
	const { data: top } = api.ratings.top.useQuery();

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
			<Stack.Screen
				options={{
					title: "Home",
				}}
			/>
			<ScrollView contentContainerClassName="flex flex-col pb-4" nestedScrollEnabled>
				<AlbumOfTheDay />
				<Text variant="h2" className="pt-6 pb-4 px-4">
					Trending
				</Text>
				<FlashList
					data={trending}
					renderItem={({ item }) => <AlbumItem {...item} />}
					horizontal
					contentContainerClassName="px-4 h-64"
					ItemSeparatorComponent={() => <View className="w-4" />}
					estimatedItemSize={150}
					ListEmptyComponent={
						<ScrollView horizontal contentContainerClassName="gap-4">
							<ResourceItemSkeleton direction="vertical" />
							<ResourceItemSkeleton direction="vertical" />
							<ResourceItemSkeleton direction="vertical" />
						</ScrollView>
					}
					showsHorizontalScrollIndicator={false}
				/>
				<Text variant="h2" className="pt-6 pb-4 px-4">
					Top Albums
				</Text>
				<FlashList
					data={top}
					renderItem={({ item }) => <AlbumItem {...item} />}
					horizontal
					contentContainerClassName="px-4 h-64"
					ItemSeparatorComponent={() => <View className="w-4" />}
					estimatedItemSize={150}
					ListEmptyComponent={
						<ScrollView horizontal contentContainerClassName="gap-4">
							<ResourceItemSkeleton direction="vertical" />
							<ResourceItemSkeleton direction="vertical" />
							<ResourceItemSkeleton direction="vertical" />
						</ScrollView>
					}
					showsHorizontalScrollIndicator={false}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomePage;
