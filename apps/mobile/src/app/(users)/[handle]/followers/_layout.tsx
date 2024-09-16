import NotFoundScreen from "#/app/+not-found";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ProfileItem } from "~/components/Item/ProfileItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const HandlePage = () => {
	const { handle, type } = useLocalSearchParams<{ handle: string; type: string }>();

	return <FollowerPage handleId={handle!} type={type} />;
};

const FollowerPage = ({ handleId, type }: { handleId: string; type?: string }) => {
	const [value, setValue] = useState(type ?? "followers");
	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [userProfile] = api.profiles.get.useSuspenseQuery(handleId);

	const tabIndex = useSharedValue(type === "following" ? 2 : 1);

	if (!userProfile) return <NotFoundScreen />;

	const { data: followerProfiles } = api.profiles.followProfiles.useQuery({
		profileId: userProfile.userId,
		type: "followers",
	});
	const { data: followingProfiles } = api.profiles.followProfiles.useQuery({
		profileId: userProfile.userId,
		type: "following",
	});
	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<Tabs value={value} onValueChange={setValue} className="w-full flex-1">
				<TabsList className="flex-row w-full">
					<TabsTrigger value="followers" className="flex-1">
						<Text>Followers</Text>
					</TabsTrigger>
					<TabsTrigger value="following" className="flex-1">
						<Text>Following</Text>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="followers" className="flex-1">
					<FlashList
						data={followerProfiles?.flatMap((item) => item.profile)}
						renderItem={({ item, index }) => (
							<View className="w-full my-2 ml-4">
								<ProfileItem
									key={index}
									profile={item}
									isUser={myProfile!.userId === item.userId}
								/>
							</View>
						)}
						estimatedItemSize={100}
					/>
				</TabsContent>
				<TabsContent value="following" className="flex-1">
					<FlashList
						data={followingProfiles?.flatMap((item) => item.profile)}
						renderItem={({ item, index }) => (
							<View className="w-full my-2 ml-4">
								<ProfileItem
									key={index}
									profile={item}
									isUser={myProfile!.userId === item.userId}
								/>
							</View>
						)}
						estimatedItemSize={100}
					/>
				</TabsContent>
			</Tabs>
		</View>
	);
};

export default HandlePage;
