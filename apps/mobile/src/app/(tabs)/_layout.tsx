import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { Bell } from "@/lib/icons/Bell";
import { Home } from "@/lib/icons/Home";
import { Rows3 } from "@/lib/icons/Rows3";
import { Search } from "@/lib/icons/Search";
import { User } from "@/lib/icons/User";
import { useNotificationObserver } from "@/lib/notifications/useNotificationObserver";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@recordscratch/lib";
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

export default function TabLayout() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const { data: notifications } = api.notifications.getUnseen.useQuery();

	useNotificationObserver();

	return (
		<Tabs
			backBehavior="history"
			screenOptions={{
				headerTitleAlign: "center",
				tabBarShowLabel: false,
				sceneStyle: {
					paddingBottom: 80,
				},
				headerTitle: (props: any) => <Text variant="h4">{props.children}</Text>,
				tabBarStyle: {
					height: 80,
					position: "absolute",
					backgroundColor:
						colorScheme === "dark" ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)",
				},
				tabBarButton: ({ style, ...props }) => (
					<Pressable
						{...props}
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					/>
				),
				tabBarBackground: () => (
					<BlurView
						tint={colorScheme === "dark" ? "dark" : "light"}
						intensity={20}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>
				),
				headerLeft: () => (
					<Pressable onPress={() => router.back()}>
						<ArrowLeft size={28} className="text-primary" />
					</Pressable>
				),
			}}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					title: "",
					tabBarIcon: ({ focused }) => (
						<Home
							size={26}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(search)"
				options={{
					title: "",
					tabBarIcon: ({ focused }) => (
						<Search
							size={26}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(feed)"
				options={{
					title: "",
					tabBarIcon: ({ focused }) => (
						<Rows3
							size={26}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(notifications)"
				options={{
					title: "",
					tabBarBadge: notifications
						? notifications > 9
							? "9+"
							: notifications
						: undefined,
					tabBarIcon: ({ focused }) => (
						<Bell
							size={26}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "",
					tabBarIcon: ({ focused }) => (
						<User
							size={26}
							className={cn(focused ? "text-primary" : "text-muted-foreground")}
						/>
					),
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
