import { api } from "@/utils/api";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Dimensions, ScrollView } from "react-native";
import NotFound from "../../+not-found";
import { getImageUrl } from "@/utils/image";
import { View } from "react-native-ui-lib";
import { UserAvatar } from "@/components/UserAvatar";
import FollowerMenu from "@/components/FollowersMenu";
import { useLayoutEffect } from "react";
import { Settings } from "lucide-react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TopLists from "@/components/TopLists";
import { ListWithResources } from "@recordscratch/types";
import DistributionChart from "@/components/DistributionChart";
import { InfiniteProfileReviews } from "@/components/InfiniteProfileReviews";

const HandlePage = () => {
	const { handle } = useLocalSearchParams();

	// Check if id is undefined or not a string
	if (typeof handle === "undefined") {
		return <div>Error: ID parameter is missing. Please provide a valid album ID.</div>;
	}

	const handleId = Array.isArray(handle) ? handle[0] : handle;

	// Check if albumId is a string
	if (typeof handleId !== "string") {
		return <div>Error: Invalid ID format. Please provide a valid album ID.</div>;
	}

	return <ProfilePage handleId={handleId} />;
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

export const ProfilePage = ({ handleId }: { handleId?: string }) => {
	let profile;

	if (handleId) {
		[profile] = api.profiles.get.useSuspenseQuery(handleId);
	} else {
		//[profile] = api.profiles.me.useSuspenseQuery();
		[profile] = api.profiles.get.useSuspenseQuery("fil");
	}

	if (!profile) return <NotFound />;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	const Tab = createMaterialTopTabNavigator();
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: `${handleId ? profile.name.toLocaleUpperCase() : "Profile"}`,
			headerRight: () => <Settings className="mr-4" />,
		});
	}, [navigation]);

	return (
		<ScrollView contentContainerClassName="flex flex-cols  mt-5" nestedScrollEnabled>
			<View className=" border-b border-gray-300">
				<View className="flex flex-col justify-start ml-5">
					<View className="flex flex-row">
						<View>
							<UserAvatar imageUrl={getImageUrl(profile)} size={75} />
							<p className="ml-6 text-muted-foreground text-lg mt-4">
								@{profile.handle}
							</p>
						</View>
						<View className="flex flex-1 flex-col items-center mt-4 mb-10">
							<FollowerMenu profileId={profile.userId} />
							<p className="pt-4 text-sm">{profile.bio || "No bio yet"}</p>
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
	);
};

export default HandlePage;
