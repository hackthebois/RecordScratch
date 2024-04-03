import { Button } from "@/components/Button";
import Metadata from "@/components/Metadata";
import { api } from "@/components/TrpcProvider";
import { Album, getQueryOptions } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import React from "react";
import { FlatList, View } from "react-native";

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

	// console.log(album);

	return (
		<View className="flex justify-center items-center h-screen">
			<Metadata title={album.title} cover={album.cover_big} type="ALBUM OF THE DAY" tags={[]}>
				<></>
			</Metadata>
			<FlatList data={trending} renderItem={({ item }) => <AlbumItem album={item} />} />
			<Button
				label="Toggle mode"
				variant="secondary"
				onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
			/>
		</View>
	);
};

export default Index;
