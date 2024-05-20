import { Tabs } from "expo-router";
import { Home } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: () => <Home size={20} className="text-muted-foreground" />,
				}}
			/>
		</Tabs>
	);
}
