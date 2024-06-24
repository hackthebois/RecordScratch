import { api } from "@/utils/api";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView } from "react-native";
import { getImageUrl } from "@/utils/image";
import { View } from "react-native-ui-lib";
import { UserAvatar } from "@/components/UserAvatar";
import FollowerMenu from "@/components/FollowersMenu";
import { useLayoutEffect } from "react";
import { Settings } from "lucide-react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TopLists from "@/components/TopLists";
import { ListWithResources, Profile } from "@recordscratch/types";
import DistributionChart from "@/components/DistributionChart";
import { InfiniteProfileReviews } from "@/components/InfiniteProfileReviews";
import NotFoundScreen from "@/app/+not-found";
import { Text } from "@/components/Text";
import { AntDesign } from "@expo/vector-icons";

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	return <ProfilePage handleId={handle!} />;
};

const ReviewsTab = ({
	topLists,
	userId,
}: {
	topLists: {
		album?: ListWithResources;
		song?: ListWithResources;
		artist?: ListWithResources;
	};
	userId: string;
}) => {
	const { data: distribution } = api.profiles.distribution.useQuery({
		userId,
	});

	return (
		<ScrollView className="flex-1">
			<TopLists className="rounded-md border border-gray-300" {...topLists} />
			<DistributionChart distribution={distribution} />
			<InfiniteProfileReviews
				input={{
					profileId: userId,
					limit: 5,
				}}
			/>
		</ScrollView>
	);
};

export const ProfilePage = ({
	handleId,
	isProfile = false,
}: {
	handleId: string;
	isProfile?: boolean;
}) => {
	const [profile] = api.profiles.get.useSuspenseQuery(handleId);

	if (!profile) return <NotFoundScreen />;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	const Tab = createMaterialTopTabNavigator();

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: `${handleId ? profile.name.toLocaleUpperCase() : "Profile"}`,
					headerRight: () =>
						isProfile ? (
							<AntDesign name="setting" size={30} color="black" className="mr-6" />
						) : null,
				}}
			/>
			<View className="flex flex-col gap-6 flex-1">
				<View className="border-b border-gray-300">
					<View className="flex flex-col justify-start ml-5">
						<View className="flex flex-col">
							<View className="flex flex-row justify-around w-full">
								<UserAvatar imageUrl={getImageUrl(profile)} size={100} />
								<FollowerMenu profileId={profile.userId} />
							</View>
							<View className="flex flex-row w-full">
								<Text className="text-muted-foreground text-lg mt-4 w-1/3 text-center">
									@{profile.handle}
								</Text>
								<Text className="py-4 w-2/3">{profile.bio || "No bio yet"}</Text>
							</View>
						</View>
					</View>
				</View>
				<Tab.Navigator
					screenOptions={{
						tabBarContentContainerStyle: {
							justifyContent: "space-around",
						},
						tabBarLabelStyle: {
							textAlign: "center",
						},
						swipeEnabled: false,
					}}
				>
					<Tab.Screen
						name="Reviews"
						children={() => <ReviewsTab topLists={topLists} userId={profile.userId} />}
					/>
					<Tab.Screen name="Lists" children={() => <View></View>} />
				</Tab.Navigator>
			</View>
		</>
	);
};

export default HandlePage;
