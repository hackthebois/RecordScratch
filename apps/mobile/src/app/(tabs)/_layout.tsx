import { cn } from "@recordscratch/lib";
import { Tabs, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { z } from "zod";
import { Text } from "~/components/ui/text";
import { TRPCProvider, api } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Home } from "~/lib/icons/Home";
import { Search } from "~/lib/icons/Search";
import { Star } from "~/lib/icons/Star";
import { User } from "~/lib/icons/User";

const ManageAuth = () => {
	const router = useRouter();

	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();
	const [myProfile] = api.profiles.me.useSuspenseQuery();

	const setProfile = useAuth((s) => s.setProfile);
	const logout = useAuth((s) => s.logout);
	const sessionId = useAuth((s) => s.sessionId);
	const setSessionId = useAuth((s) => s.setSessionId);

	useEffect(() => {
		if (myProfile) {
			setProfile(myProfile!);
		} else {
			logout().then(() => router.push("(auth)/signin"));
		}
	}, [myProfile]);

	useEffect(() => {
		if (needsOnboarding) {
			router.push("/onboarding");
		}
	}, [needsOnboarding]);

	useEffect(() => {
		const getToken = async () => {
			await fetch(
				`${process.env.EXPO_PUBLIC_CF_PAGES_URL}/auth/refresh?sessionId=${sessionId}`
			)
				.then(async (response) => {
					return z
						.object({
							sessionId: z.string(),
						})
						.safeParse(await response.json());
				})
				.then((parsedData) => {
					if (parsedData.error) console.error(parsedData.error);
					else {
						console.log(`Parsed Session ID: ${parsedData.data.sessionId}`);
						setSessionId(parsedData.data.sessionId);
					}
				})
				.catch(function (err) {
					console.log(err);
				});
		};
		getToken();
	}, []);

	return <></>;
};

export default function TabLayout() {
	const router = useRouter();
	return (
		<TRPCProvider>
			<ManageAuth />
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
		</TRPCProvider>
	);
}
