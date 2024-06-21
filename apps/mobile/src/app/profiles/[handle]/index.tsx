import NotFoundScreen from "@/app/+not-found";
import DistributionChart from "@/components/DistributionChart";
import FollowerMenu from "@/components/FollowersMenu";
import { InfiniteProfileReviews } from "@/components/InfiniteProfileReviews";
import { Text } from "@/components/Text";
import TopLists from "@/components/TopLists";
import { UserAvatar } from "@/components/UserAvatar";
import { api } from "@/utils/api";
import { getImageUrl } from "@/utils/image";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ListWithResources } from "@recordscratch/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { Settings } from "lucide-react-native";
import { ScrollView } from "react-native";
import { View } from "react-native-ui-lib";

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
			<View className="rounded-md border mb-1">
				<TopLists {...topLists} />
			</View>
			<DistributionChart distribution={distribution} />
			<InfiniteProfileReviews
				input={{
					profileId: userId,
					limit: 20,
				}}
			/>
		</ScrollView>
	);
};

export const ProfilePage = ({ handleId }: { handleId: string }) => {
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
					headerRight: () => (!handleId ? <Settings className="mr-4" /> : null),
				}}
			/>
			<ScrollView contentContainerClassName="flex flex-cols  mt-5" nestedScrollEnabled>
				<View className=" border-b border-gray-300">
					<View className="flex flex-col justify-start ml-5">
						<View className="flex flex-row">
							<View>
								<UserAvatar imageUrl={getImageUrl(profile)} size={75} />
								<Text className="ml-6 text-muted-foreground text-lg mt-4">
									@{profile.handle}
								</Text>
							</View>
							<View className="flex flex-1 flex-col items-center mt-4 mb-10">
								<FollowerMenu profileId={profile.userId} />
								<Text className="pt-4 text-sm">{profile.bio || "No bio yet"}</Text>
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
			</ScrollView>
		</>
	);
};

export default HandlePage;
