import { Button } from "@/components/Button";
import Metadata from "@/components/Metadata";
import { ResourceItem } from "@/components/ResourceItem";
import { Text } from "@/components/Text";
import { api } from "@/utils/api";
import { cn, formatDuration } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotFound from "../+not-found";
import { getQueryOptions } from "@/utils/deezer";
import { Link, useRouter } from "expo-router";

const AlbumItem = ({
	resourceId,
	className,
}: {
	total: number;
	resourceId: string;
	className?: string;
}) => {
	return (
		<View className={cn(className)}>
			<ResourceItem
				direction="vertical"
				resource={{
					resourceId: resourceId,
					category: "ALBUM",
					parentId: "",
				}}
				titleCss="line-clamp-2 w-40"
				artistNameCss="w-40 line-clamp-1"
			/>
		</View>
	);
};

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
				className=" w-1/3"
				onPress={() => {
					router.push(`/albums/${albumOfTheDay.albumId}`);
				}}
			>
				Go to Album
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
