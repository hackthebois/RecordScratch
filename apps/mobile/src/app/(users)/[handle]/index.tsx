import NotFoundScreen from "#/app/+not-found";
import DistributionChart from "~/components/DistributionChart";
import FollowerMenu from "~/components/Followers/FollowersMenu";
import { InfiniteProfileReviews } from "~/components/Infinite/InfiniteProfileReviews";
import { Text } from "~/components/CoreComponents/Text";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/lib/api";
import { getImageUrl } from "~/lib/image";
import { ListWithResources, ListsType } from "@recordscratch/types";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Dimensions, TouchableOpacity, View, ViewBase } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { FollowButton } from "~/components/Followers/FollowButton";
import { ResourceList } from "~/components/List/TopLists";
import ListsItem from "~/components/Item/ListItem";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { useState } from "react";
import ColumnItem from "~/components/CoreComponents/ColumnItem";

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	return <ProfilePage handleId={handle!} />;
};

const ReviewsTab = ({ userId, headerHeight }: { userId: string; headerHeight: number }) => {
	const { data: distribution } = api.profiles.distribution.useQuery({
		userId,
	});

	const RenderInfiniteProfileReviews = ({
		category,
		rating,
	}: {
		category?: "ALBUM" | "SONG";
		rating?: number;
	}) => (
		<InfiniteProfileReviews
			input={{
				profileId: userId,
				limit: 3,
				category,
				rating,
			}}
		/>
	);

	return (
		<Tabs.Container
			renderHeader={() => (
				<View style={{ marginTop: headerHeight }}>
					<DistributionChart distribution={distribution} />
				</View>
			)}
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
						left: (Dimensions.get("window").width / 2 - 225) / 3,
						backgroundColor: "orange",
					}}
				/>
			)}
		>
			<Tabs.Tab name="All">
				<RenderInfiniteProfileReviews />
			</Tabs.Tab>
			<Tabs.Tab name="Albums">
				<RenderInfiniteProfileReviews category="ALBUM" />
			</Tabs.Tab>
			<Tabs.Tab name="Songs">
				<RenderInfiniteProfileReviews category="SONG" />
			</Tabs.Tab>
		</Tabs.Container>
	);
};

const TopListsTab = ({
	album,
	song,
	artist,
	headerHeight,
}: {
	album: ListWithResources | undefined;
	song: ListWithResources | undefined;
	artist: ListWithResources | undefined;
	headerHeight: number;
}) => {
	const tabHeight = headerHeight + 75;

	return (
		<Tabs.Container
			renderHeader={() => <View style={{ marginTop: headerHeight }}></View>}
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
						left: (Dimensions.get("window").width / 2 - 225) / 3,
						backgroundColor: "orange",
					}}
				/>
			)}
		>
			<Tabs.Tab name="Albums">
				<View style={{ marginTop: tabHeight }}>
					<ResourceList data={album?.resources} category="ALBUM" />
				</View>
			</Tabs.Tab>
			<Tabs.Tab name="Songs">
				<View style={{ marginTop: tabHeight }}>
					<ResourceList data={song?.resources} category="SONG" />
				</View>
			</Tabs.Tab>
			<Tabs.Tab name="Artists">
				<View style={{ marginTop: tabHeight }}>
					<ResourceList data={artist?.resources} category="ARTIST" />
				</View>
			</Tabs.Tab>
		</Tabs.Container>
	);
};

const ListTab = ({ lists }: { lists: ListsType[] }) => {
	return (
		<Tabs.FlashList
			className="w-full"
			data={lists}
			renderItem={({ index, item }) => (
				<ColumnItem index={index} numColumns={2} className="px-8 py-4">
					<ListsItem listsItem={item} />
				</ColumnItem>
			)}
			numColumns={2}
			style={{ flex: 1, justifyContent: "space-around" }}
			contentContainerClassName="gap-4 px-4 pb-4 mt-3"
			estimatedItemSize={350}
		/>
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
	const [headerHeight, setHeaderHeight] = useState<number>(0);

	if (!profile) return <NotFoundScreen />;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	const router = useRouter();

	const Header = () => (
		<View
			className="mt-4"
			onLayout={(event) => {
				setHeaderHeight(event.nativeEvent.layout.height + 75);
			}}
		>
			<View className="flex flex-col justify-start ml-5">
				<View className="flex flex-col">
					<View className="flex flex-row justify-around items-center w-full">
						<UserAvatar imageUrl={getImageUrl(profile)} size={100} />
						<FollowerMenu profileId={profile.userId} handleId={handleId} />
					</View>
					<View className="flex flex-row w-full">
						<Text className="text-muted-foreground text-lg mt-4 w-1/3 text-center">
							@{profile.handle}
						</Text>
						<Text className="px-4 pt-4 text-wrap truncate w-2/3">
							{profile.bio || "No bio yet"}
						</Text>
					</View>

					<View className=" my-3">
						{!isProfile ? <FollowButton profileId={profile.userId} /> : null}
					</View>
				</View>
			</View>
		</View>
	);

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
				<Tabs.Container
					renderHeader={Header}
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
								left: (Dimensions.get("window").width / 2 - 225) / 3,
								backgroundColor: "orange",
							}}
						/>
					)}
				>
					<Tabs.Tab name="Reviews">
						<ReviewsTab userId={profile.userId} headerHeight={headerHeight} />
					</Tabs.Tab>
					<Tabs.Tab name="Top 6">
						<TopListsTab {...topLists} headerHeight={headerHeight} />
					</Tabs.Tab>
					<Tabs.Tab name="Lists">
						<ListTab lists={lists} />
					</Tabs.Tab>
				</Tabs.Container>
			</View>
		</>
	);
};

export default HandlePage;
// <Tab.Navigator
// 	screenOptions={{
// 		tabBarContentContainerStyle: {
// 			justifyContent: "space-around",
// 		},
// 		tabBarLabelStyle: {
// 			textAlign: "center",
// 			fontSize: 12,
// 		},

// 		tabBarStyle: {
// 			width: "auto",
// 			elevation: 0, // Remove shadow on Android
// 			shadowOpacity: 0, // Remove shadow on iOS
// 			backgroundColor: "#F2F2F2", // Background color of the tab bar
// 			borderRadius: 10,
// 			margin: 10,
// 		},
// 		tabBarIndicatorStyle: {
// 			backgroundColor: "white", // Set the indicator background color to white
// 			height: "90%", // Adjust the height as needed
// 			width: "33%", // Adjust the width to make it fit within the tabs
// 			paddingHorizontal: 10,
// 			marginBottom: "5%",
// 			borderRadius: 10,
// 		},
// 		tabBarPressColor: "transparent",
// 	}}
// >
