import { SearchBar } from "@/components/SearchBar";
import { Tabs, useNavigation } from "expo-router";
import { CircleArrowUp, Home, Star, User, View } from "lucide-react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndexPage from ".";
import HomePage from "./home";
import FeedPage from "./feed";
import { ProfilePage } from "../profiles/[handle]/_layout";

const Tab = createBottomTabNavigator();
export default function TabLayout() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "blue",
				headerTitleAlign: "center",
			}}
		>
			<Tab.Screen
				name="index"
				options={{
					title: "",
					headerShown: false,
					tabBarIcon: () => <CircleArrowUp size={20} className="text-muted-foreground" />,
				}}
				children={() => <IndexPage />}
			/>
			<Tab.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: true,
					tabBarIcon: () => <Home size={20} className="text-muted-foreground" />,
					headerRight: () => {
						return <SearchBar />;
					},
				}}
				children={() => <HomePage />}
			/>
			<Tab.Screen
				name="feed"
				options={{
					title: "Feed",
					headerShown: true,
					tabBarIcon: () => <Star size={25} className="text-muted-foreground" />,
				}}
				children={() => <FeedPage />}
			/>
			<Tab.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: true,
					tabBarIcon: () => <User size={25} className="text-muted-foreground" />,
				}}
				children={() => <ProfilePage />}
			/>
		</Tab.Navigator>
	);
}
