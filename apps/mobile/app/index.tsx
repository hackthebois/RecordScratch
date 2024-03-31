import React from "react";
import { Text, View } from "react-native";

const Index = () => {
	// const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	// const { data: album } = useSuspenseQuery(
	// 	getQueryOptions({
	// 		route: "/album/{id}",
	// 		input: { id: "11591214" },
	// 	})
	// );

	// console.log(album);

	return (
		<View className="flex justify-center items-center h-screen">
			<Text className="text-blue-400">Test</Text>
		</View>
	);
};

export default Index;
