import { cn } from "@recordscratch/lib";
import { Tabs } from "expo-router";
import React from "react";
import { SearchBar } from "~/components/Search/SearchBar";
import { Text } from "~/components/ui/text";
import { Home } from "~/lib/icons/Home";
import { Star } from "~/lib/icons/Star";
import { User } from "~/lib/icons/User";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#ffb703",
				headerTitleAlign: "center",
				tabBarLabel: ({ focused, children }) => (
					<Text
						className={cn(
							focused ? "text-primary" : "text-muted-foreground",
							"text-sm font-semibold"
						)}
					>
						{children}
					</Text>
				),
				tabBarStyle: {
					height: 90,
					paddingTop: 12,
				},
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
					tabBarIcon: ({ focused }) => (
						<Home
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerLeftLabelVisible: false,
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
					tabBarIcon: ({ focused }) => (
						<Star
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: true,
					tabBarIcon: ({ focused }) => (
						<User
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
