import { SearchBar } from "#/components/Search/SearchBar";
import { Tabs } from "expo-router";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TextStyle } from "react-native";
import { useColorScheme } from "#/utils/useColorScheme";

export default function TabLayout() {
	const iconSize = 30;
	const tabBarLabelStyle: TextStyle = {
		fontSize: 14,
		fontWeight: "bold",
	};
	const { utilsColor } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#ffb703",
				headerTitleAlign: "center",
				tabBarLabelStyle: tabBarLabelStyle,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Onboard",
					headerShown: true,
					tabBarIcon: () => null,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: true,
					tabBarIcon: () => <AntDesign name="home" size={iconSize} color={utilsColor} />,
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
					tabBarIcon: () => <AntDesign name="staro" size={iconSize} color={utilsColor} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: true,
					tabBarIcon: () => <AntDesign name="user" size={iconSize} color={utilsColor} />,
				}}
			/>
		</Tabs>
	);
}
