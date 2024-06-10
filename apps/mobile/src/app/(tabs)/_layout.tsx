import { SearchBar } from "@/components/SearchBar";
import { Tabs } from "expo-router";
import { CircleArrowUp, Home, Star, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "blue",
				headerTitleAlign: "center",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					headerShown: false,
					tabBarIcon: () => <CircleArrowUp size={20} className="text-muted-foreground" />,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: true,
					tabBarIcon: () => <Home size={20} className="text-muted-foreground" />,
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
					tabBarIcon: () => <Star size={25} className="text-muted-foreground" />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: true,
					tabBarIcon: () => <User size={25} className="text-muted-foreground" />,
				}}
			/>
		</Tabs>
	);
}
