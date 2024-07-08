import NotFoundScreen from "@/app/+not-found";
import DistributionChart from "@/components/DistributionChart";
import FollowerMenu from "@/components/FollowersMenu";
import { InfiniteProfileReviews } from "@/components/InfiniteProfileReviews";
import { Text } from "@/components/Text";
import TopLists, { ResourceList } from "@/components/TopLists";
import { UserAvatar } from "@/components/UserAvatar";
import { api } from "@/utils/api";
import { getImageUrl } from "@/utils/image";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Category, ListWithResources, ListsType, Profile } from "@recordscratch/types";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FlatList, ScrollView, TouchableOpacity, View, ViewBase } from "react-native";
import { useColorScheme } from "@/utils/useColorScheme";
import ListsItem from "@/components/ListItem";

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	return <ProfilePage handleId={handle!} />;
};

const ReviewsTab = ({ userId }: { userId: string }) => {
	const { data: distribution } = api.profiles.distribution.useQuery({
		userId,
	});

	const Tab = createMaterialTopTabNavigator();
	const RenderInfiniteProfileReviews = ({
		category,
		rating,
	}: {
		category?: "ALBUM" | "SONG";
		rating?: number;
	}) => (
		// <InfiniteProfileReviews
		// 	input={{
		// 		profileId: userId,
		// 		limit: 10,
		// 		category,
		// 		rating,
		// 	}}
		// />
		<></>
	);

	return (
		<ScrollView className="flex-1 mt-2">
			<DistributionChart distribution={distribution} />
			<Tab.Navigator
				screenOptions={{
					tabBarContentContainerStyle: {
						justifyContent: "space-around",
					},
					tabBarLabelStyle: {
						textAlign: "center",
						fontSize: 12,
					},

					tabBarStyle: {
						width: "auto",
						elevation: 0, // Remove shadow on Android
						shadowOpacity: 0, // Remove shadow on iOS
						backgroundColor: "#F2F2F2", // Background color of the tab bar
						borderRadius: 10,
						margin: 10,
					},
					tabBarIndicatorStyle: {
						backgroundColor: "white", // Set the indicator background color to white
						height: "90%", // Adjust the height as needed
						width: "33%", // Adjust the width to make it fit within the tabs
						paddingHorizontal: 10,
						marginBottom: "5%",
						borderRadius: 10,
					},
					tabBarPressColor: "transparent",
				}}
			>
				<Tab.Screen name="All" children={() => <RenderInfiniteProfileReviews />} />
				<Tab.Screen
					name="Albums"
					children={() => <RenderInfiniteProfileReviews category="ALBUM" />}
				/>
				<Tab.Screen
					name="Songs"
					children={() => <RenderInfiniteProfileReviews category="SONG" />}
				/>
			</Tab.Navigator>
		</ScrollView>
	);
};

const TopListsTab = ({
	album,
	song,
	artist,
}: {
	album: ListWithResources | undefined;
	song: ListWithResources | undefined;
	artist: ListWithResources | undefined;
}) => {
	const Tab = createMaterialTopTabNavigator();

	return (
		<View className="flex flex-1 mt-4">
			<Tab.Navigator
				screenOptions={{
					tabBarContentContainerStyle: {
						justifyContent: "space-around",
					},
					tabBarLabelStyle: {
						textAlign: "center",
						fontSize: 15,
					},

					tabBarStyle: {
						width: "auto",
						elevation: 0, // Remove shadow on Android
						shadowOpacity: 0, // Remove shadow on iOS
						backgroundColor: "#F2F2F2", // Background color of the tab bar
						borderRadius: 10,
						margin: 10,
					},
					tabBarIndicatorStyle: {
						backgroundColor: "white", // Set the indicator background color to white
						height: "90%", // Adjust the height as needed
						width: "33%", // Adjust the width to make it fit within the tabs
						marginBottom: "5%",
						borderRadius: 10,
					},
					tabBarPressColor: "transparent",
				}}
			>
				<Tab.Screen
					name="Albums"
					children={() => <ResourceList data={album?.resources} category="ALBUM" />}
				/>
				<Tab.Screen
					name="Songs"
					children={() => <ResourceList data={song?.resources} category="SONG" />}
				/>
				<Tab.Screen
					name="Artists"
					children={() => <ResourceList data={artist?.resources} category="ARTIST" />}
				/>
			</Tab.Navigator>
		</View>
	);
};

const ListTab = ({ lists }: { lists: ListsType[] }) => {
	return (
		<ScrollView className="flex flex-1 mt-6">
			<FlatList
				data={lists}
				renderItem={({ item }) => <ListsItem listsItem={item} />}
				numColumns={2}
				columnWrapperStyle={{
					flex: 1,
					justifyContent: "space-around",
				}}
				horizontal={false}
				contentContainerClassName="gap-4 px-4 pb-4 mt-3"
				scrollEnabled={false}
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
	const { utilsColor } = useColorScheme();
	const [profile] = api.profiles.get.useSuspenseQuery(handleId);

	if (!profile) return <NotFoundScreen />;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	const Tab = createMaterialTopTabNavigator();
	const router = useRouter();

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: `${handleId ? profile.name.toLocaleUpperCase() : "Profile"}`,
					headerRight: () =>
						isProfile ? (
							<TouchableOpacity onPress={() => router.push(`${handleId}/settings`)}>
								<AntDesign
									name="setting"
									size={30}
									color={utilsColor}
									className="mr-6"
								/>
							</TouchableOpacity>
						) : null,
				}}
			/>
			<View className="flex flex-col gap-6 flex-1 mt-5">
				<View className="">
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
								<Text className="pl-4 pt-4 w-full">
									{profile.bio || "No bio yet"}
								</Text>
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
							marginTop: -5,
						},
						swipeEnabled: false,
					}}
				>
					<Tab.Screen
						name="Reviews"
						children={() => <ReviewsTab userId={profile.userId} />}
					/>
					<Tab.Screen name="Top 6" children={() => <TopListsTab {...topLists} />} />
					<Tab.Screen name="Lists" children={() => <ListTab lists={lists} />} />
				</Tab.Navigator>
			</View>
		</>
	);
};

export default HandlePage;
