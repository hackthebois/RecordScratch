import { cn } from "@recordscratch/lib";
import { Tabs, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Home } from "~/lib/icons/Home";
import { Search } from "~/lib/icons/Search";
import { Star } from "~/lib/icons/Star";
import { User } from "~/lib/icons/User";

export default function TabLayout() {
	const router = useRouter();
	return (
		<Tabs
			backBehavior="history"
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
				headerLeft: () => (
					<Pressable onPress={() => router.back()}>
						<ArrowLeft size={28} className="text-primary" />
					</Pressable>
				),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: () => null,
					href: null,
					headerLeft: () => null,
				}}
			/>
			<Tabs.Screen
				name="(home)"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => (
						<Home
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(search)"
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
				name="(feed)"
				options={{
					title: "Feed",
					tabBarIcon: ({ focused }) => (
						<Star
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => (
						<User
							size={28}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
