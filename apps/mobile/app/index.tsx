import Metadata from "@/components/Metadata";
import { api } from "@/components/TrpcProvider";
import { getQueryOptions } from "@recordscratch/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

const Index = () => {
	const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumOfTheDay?.albumId! },
		})
	);

	// console.log(album);

	return (
		<View className="flex justify-center items-center h-screen">
			<Metadata title={album.title} cover={album.cover_big} type="ALBUM OF THE DAY" tags={[]}>
				<></>
			</Metadata>
		</View>
	);
};

export default Index;
