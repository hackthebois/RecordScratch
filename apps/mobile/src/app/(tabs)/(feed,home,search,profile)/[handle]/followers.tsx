import NotFoundScreen from "#/app/+not-found";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ProfileItem } from "~/components/Item/ProfileItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";

const Followers = () => {
	const { handle, type } = useLocalSearchParams<{ handle: string; type: string }>();
	const [tab, setTab] = useState(type ?? "followers");
	const profile = useAuth((s) => s.profile);

	const [userProfile] = api.profiles.get.useSuspenseQuery(handle);

	if (!userProfile) return <NotFoundScreen />;

	const { data: followerProfiles } = api.profiles.followProfiles.useQuery(
		{
			profileId: userProfile.userId,
			type: "followers",
		},
		{
			enabled: tab === "followers",
		}
	);
	const { data: followingProfiles } = api.profiles.followProfiles.useQuery(
		{
			profileId: userProfile.userId,
			type: "following",
		},
		{
			enabled: tab === "following",
		}
	);

	return (
		<>
			<Stack.Screen
				options={{
					title: tab === "followers" ? "Followers" : "Following",
					headerBackVisible: true,
				}}
			/>
			<Tabs value={tab} onValueChange={setTab} className="flex-1">
				<View className="w-full px-4">
					<TabsList className="flex-row">
						<TabsTrigger value="followers" className="flex-1">
							<Text>Followers</Text>
						</TabsTrigger>
						<TabsTrigger value="following" className="flex-1">
							<Text>Following</Text>
						</TabsTrigger>
					</TabsList>
				</View>
				<TabsContent value="followers" className="flex-1">
					<FlashList
						data={followerProfiles?.flatMap((item) => item.profile)}
						renderItem={({ item }) => (
							<ProfileItem profile={item} isUser={profile!.userId === item.userId} />
						)}
						estimatedItemSize={60}
						ItemSeparatorComponent={() => <View className="h-3" />}
						className="px-4"
						contentContainerClassName="py-4"
					/>
				</TabsContent>
				<TabsContent value="following" className="flex-1">
					<FlashList
						data={followingProfiles?.flatMap((item) => item.profile)}
						renderItem={({ item }) => (
							<ProfileItem profile={item} isUser={profile!.userId === item.userId} />
						)}
						estimatedItemSize={60}
						ItemSeparatorComponent={() => <View className="h-3" />}
						className="px-4"
						contentContainerClassName="py-4"
					/>
				</TabsContent>
			</Tabs>
		</>
	);
};

export default Followers;
