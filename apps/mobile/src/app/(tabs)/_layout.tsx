import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { Bell } from "@/lib/icons/Bell";
import { Home } from "@/lib/icons/Home";
import { Rows3 } from "@/lib/icons/Rows3";
import { Search } from "@/lib/icons/Search";
import { User } from "@/lib/icons/User";
import { useNotificationObserver } from "@/lib/notifications/useNotificationObserver";
import { cn } from "@recordscratch/lib";
import { Tabs, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
	const router = useRouter();
	const { data: notifications } = api.notifications.getUnseen.useQuery();
	const insets = useSafeAreaInsets();

	useNotificationObserver();

	return (
		<Tabs
			backBehavior="history"
			screenOptions={{
				tabBarActiveTintColor: "#ffb703",
				headerTitleAlign: "center",
				tabBarLabel: ({ focused, children }: any) => (
					<Text
						className={cn(
							focused ? "text-primary" : "text-muted-foreground",
							"text-sm font-semibold"
						)}
					>
						{children}
					</Text>
				),
				headerTitle: (props: any) => <Text variant="h4">{props.children}</Text>,
				tabBarStyle: {
					height: 70,
					paddingTop: 8,
					paddingBottom: insets.bottom,
				},
				tabBarItemStyle: {
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				},
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
					title: "",
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
					title: "",
					tabBarIcon: ({ focused }) => (
						<Rows3
							size={28}
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
					tabBarIcon: ({ focused }) => (
						<View className="relative">
							<Bell
								size={28}
								className={cn(focused ? "text-primary" : "text-muted-foreground")}
							/>
							{notifications && notifications > 0 ? (
								<View className="absolute -top-2 -right-1.5 bg-destructive px-1 h-5 min-w-5 rounded-full flex items-center justify-center">
									<Text className="text-xs text-white font-semibold">
										{notifications > 99 ? "99+" : notifications}
									</Text>
								</View>
							) : null}
						</View>
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
