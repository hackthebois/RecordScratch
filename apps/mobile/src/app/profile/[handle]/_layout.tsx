import { Tabs } from "expo-router";
import { Home } from "lucide-react-native";

export default function HandleLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: () => <Home size={20} className="text-muted-foreground" />,
					href: "/home",
				}}
			/>
		</Tabs>
	);
}
