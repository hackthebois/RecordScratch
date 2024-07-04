import { SearchBar } from "@/components/SearchBar";
import { Tabs } from "expo-router";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { TextStyle } from "react-native";

export default function TabLayout() {
	const iconSize = 30;
	const tabBarLabelStyle: TextStyle = {
		fontSize: 14,
		fontWeight: "bold",
	};

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "blue",
				headerTitleAlign: "center",
				tabBarLabelStyle: tabBarLabelStyle,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					headerShown: true,
					tabBarIcon: () => <AntDesign name="home" size={iconSize} color="black" />,
					headerRight: () => {
						return <SearchBar />;
					},
				}}
			/>
			<Tabs.Screen
				name="feed"
				options={{
					title: "Feed",
					headerShown: true,
					tabBarIcon: () => <AntDesign name="staro" size={iconSize} color="black" />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: true,
					tabBarIcon: () => <AntDesign name="user" size={iconSize} color="black" />,
				}}
			/>
		</Tabs>
	);
}
