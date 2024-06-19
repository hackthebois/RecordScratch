import { SearchBar } from "@/components/SearchBar";
import { Tabs, useNavigation } from "expo-router";
import { CircleArrowUp, Home, Star, User, View } from "lucide-react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndexPage from ".";
import HomePage from "./home";
import FeedPage from "./feed";
import { ProfilePage } from "../profiles/[handle]";

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
					title: "Sign In",
					headerShown: false,
					tabBarIcon: () => <CircleArrowUp size={20} className="text-muted-foreground" />,
					tabBarButton: () => null,
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
