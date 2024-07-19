import NotFoundScreen from "#/app/+not-found";
import { Text } from "#/components/CoreComponents/Text";
import { ProfileItem } from "#/components/Item/ProfileItem";
import { api } from "#/utils/api";
import { Stack, useLocalSearchParams } from "expo-router";
import { Dimensions, View } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import { useSharedValue } from "react-native-reanimated";

const HandlePage = () => {
	const { handle, type } = useLocalSearchParams<{ handle: string; type: string }>();

	return <FollowerPage handleId={handle!} type={type} />;
};

const FollowerPage = ({ handleId, type }: { handleId: string; type?: string }) => {
	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [userProfile] = api.profiles.get.useSuspenseQuery(handleId);

	const tabIndex = useSharedValue(type === "following" ? 2 : 1);
	console.log(type, tabIndex);

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
		<>
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<Tabs.Container
				renderTabBar={(props) => (
					<MaterialTabBar
						{...props}
						contentContainerStyle={{
							flexDirection: "row",
							justifyContent: "space-around",
							padding: 16,
						}}
						labelStyle={{ fontSize: 16 }}
						indicatorStyle={{
							left: (Dimensions.get("window").width / 2 - 225) / 2,
							backgroundColor: "orange",
						}}
					/>
				)}
			>
				<Tabs.Tab name="Followers">
					<Tabs.FlatList
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
					/>
				</Tabs.Tab>
				<Tabs.Tab name="Following">
					<Tabs.FlatList
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
					/>
				</Tabs.Tab>
			</Tabs.Container>
		</>
	);
};

export default HandlePage;
