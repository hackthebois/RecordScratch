import { cn } from "@recordscratch/lib";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "~/components/ui/text";
import { Home } from "~/lib/icons/Home";
import { Search } from "~/lib/icons/Search";
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
				headerTitle: (props) => <Text variant="h4">{props.children}</Text>,
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
					tabBarIcon: () => null,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => (
						<Home
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ focused }) => (
						<Search
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="feed"
				options={{
					title: "Feed",
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
					tabBarIcon: ({ focused }) => (
						<User
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="albums/[albumId]"
				options={{
					headerShown: false,
					href: null,
				}}
			/>
		</Tabs>
	);
}
