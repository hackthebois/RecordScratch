import { Tabs } from "expo-router";
import { Home, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					headerShown: false,
					tabBarIcon: () => <Home size={20} className="text-muted-foreground" />,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: () => <Home size={20} className="text-muted-foreground" />,
					href: "/home",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: () => <User size={25} className="text-muted-foreground" />,
					href: {
						pathname: "/profile",
					},
				}}
			/>
		</Tabs>
	);
}
