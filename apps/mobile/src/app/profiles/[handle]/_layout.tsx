import { api } from "@/utils/api";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import NotFound from "../../+not-found";
import { getImageUrl } from "@/utils/image";
import { View } from "react-native-ui-lib";
import { UserAvatar } from "@/components/UserAvatar";
import FollowerMenu from "@/components/FollowersMenu";
import { useLayoutEffect } from "react";
import { Settings } from "lucide-react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Category, ListWithResources, UserListItem } from "@recordscratch/types/src/list";
import { ResourceItem } from "@/components/ResourceItem";

const TopLists = ({ lists }: { lists?: ListWithResources }) => {
	return (
		<View>
			<FlatList
				data={lists?.resources}
				renderItem={({ item: resource }) => (
					<View className="mx-1">
						<ResourceItem
							resource={{
								parentId: resource.parentId!,
								resourceId: resource.resourceId,
								category: "ALBUM",
							}}
							direction="vertical"
							imageCss="min-w-[32px] rounded -mb-3"
							titleCss="font-medium line-clamp-2"
							showArtist={false}
						/>
					</View>
				)}
				numColumns={3}
			/>
		</View>
	);
};

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
						<View className="flex flex-1 flex-col items-center mt-4">
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
				}}
			>
				<Tab.Screen name="Reviews" children={() => <TopLists lists={topLists.album} />} />
				<Tab.Screen name="Lists" children={() => <View></View>} />
			</Tab.Navigator>
		</ScrollView>
	);
};

export default HandlePage;
