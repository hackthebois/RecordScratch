import NotFoundScreen from "#/app/+not-found";
import { ListWithResources } from "@recordscratch/types";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import ColumnItem from "~/components/CoreComponents/ColumnItem";
import DistributionChart from "~/components/DistributionChart";
import { FollowButton } from "~/components/Followers/FollowButton";
import FollowerMenu from "~/components/Followers/FollowersMenu";
import { ArtistItem } from "~/components/Item/ArtistItem";
import ListsItem from "~/components/Item/ListItem";
import { ResourceItem } from "~/components/Item/ResourceItem";
import { ReviewsList } from "~/components/ReviewsList";
import { UserAvatar } from "~/components/UserAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/Authentication";
import { api } from "~/lib/api";
import { Settings } from "~/lib/icons/Settings";
import { getImageUrl } from "~/lib/image";

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	return <ProfilePage handleId={handle!} />;
};

const ReviewsTab = ({ userId }: { userId: string }) => {
	const [value, setValue] = useState("all");
	const [rating, setRating] = useState<number | undefined>(undefined);
	const { data: distribution } = api.profiles.distribution.useQuery({
		userId,
	});

	const { data, fetchNextPage, hasNextPage } = api.ratings.user.recent.useInfiniteQuery(
		{
			limit: 5,
			profileId: userId,
			rating,
			category: value === "albums" ? "ALBUM" : value === "songs" ? "SONG" : undefined,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	return (
		<>
			<DistributionChart distribution={distribution} value={rating} onChange={setRating} />
			<Tabs value={value} onValueChange={setValue} className="w-full">
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="all" className="flex-1">
							<Text>All</Text>
						</TabsTrigger>
						<TabsTrigger value="albums" className="flex-1">
							<Text>Albums</Text>
						</TabsTrigger>
						<TabsTrigger value="songs" className="flex-1">
							<Text>Songs</Text>
						</TabsTrigger>
					</TabsList>
				</View>
			</Tabs>
			<ReviewsList
				pages={data?.pages}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
			/>
		</>
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
	const [value, setValue] = useState("albums");

	return (
		<Tabs value={value} onValueChange={setValue} className="mt-2">
			<View className="px-4">
				<TabsList className="flex-row w-full">
					<TabsTrigger value="albums" className="flex-1">
						<Text>Albums</Text>
					</TabsTrigger>
					<TabsTrigger value="songs" className="flex-1">
						<Text>Songs</Text>
					</TabsTrigger>
					<TabsTrigger value="artists" className="flex-1">
						<Text>Artists</Text>
					</TabsTrigger>
				</TabsList>
			</View>
			<TabsContent value="albums" className="flex-row flex-wrap justify-between gap-2 p-4">
				{album?.resources.map((album) => (
					<ResourceItem
						key={album.resourceId}
						resource={{
							parentId: album.parentId!,
							resourceId: album.resourceId,
							category: "ALBUM",
						}}
						direction="vertical"
						titleCss="font-medium line-clamp-2"
						showArtist={false}
						className="w-[115px]"
						imageWidthAndHeight={115}
					/>
				))}
			</TabsContent>
			<TabsContent value="songs" className="flex-row flex-wrap justify-between gap-2 p-4">
				{song?.resources.map((song) => (
					<ResourceItem
						key={song.resourceId}
						resource={{
							parentId: song.parentId!,
							resourceId: song.resourceId,
							category: "SONG",
						}}
						direction="vertical"
						titleCss="font-medium line-clamp-2"
						className="w-[115px]"
						showArtist={false}
						imageWidthAndHeight={115}
					/>
				))}
			</TabsContent>
			<TabsContent value="artists" className="flex-row flex-wrap justify-between gap-2 p-4">
				{artist?.resources.map((artist) => (
					<ArtistItem
						key={artist.resourceId}
						artistId={artist.resourceId}
						direction="vertical"
						textCss="font-medium line-clamp-2 text-center"
					/>
				))}
			</TabsContent>
		</Tabs>
	);
};

export const ProfilePage = ({ handleId }: { handleId?: string }) => {
	const [value, setValue] = useState("reviews");
	const { myProfile } = useAuth();
	const [profile] = handleId ? api.profiles.get.useSuspenseQuery(handleId) : [myProfile];

	if (!profile) return <NotFoundScreen />;

	const isProfile = myProfile?.userId === profile.userId;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	const router = useRouter();

	return (
		<View className="flex flex-1">
			<Stack.Screen
				options={{
					title: `${handleId ? profile.name.toLocaleUpperCase() : "Profile"}`,
					headerRight: () =>
						isProfile ? (
							<TouchableOpacity onPress={() => router.push(`(users)/settings`)}>
								<Settings size={22} className="mr-6 text-foreground" />
							</TouchableOpacity>
						) : null,
				}}
			/>
			<View className="mt-4">
				<View className="flex flex-col justify-start ml-5">
					<View className="flex flex-col">
						<View className="flex flex-row justify-around items-center w-full">
							<UserAvatar imageUrl={getImageUrl(profile)} size={100} />
							<FollowerMenu profileId={profile.userId} handleId={profile.handle} />
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
			<Tabs value={value} onValueChange={setValue} className="w-full flex-1">
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="reviews" className="flex-1">
							<Text>Reviews</Text>
						</TabsTrigger>
						<TabsTrigger value="top" className="flex-1">
							<Text>Top 6</Text>
						</TabsTrigger>
						<TabsTrigger value="lists" className="flex-1">
							<Text>Lists</Text>
						</TabsTrigger>
					</TabsList>
				</View>
				<TabsContent value="reviews">
					<ReviewsTab userId={profile.userId} />
				</TabsContent>
				<TabsContent value="top">
					<TopListsTab {...topLists} />
				</TabsContent>
				<TabsContent value="lists">
					<FlashList
						data={lists}
						renderItem={({ index, item }) => (
							<ColumnItem index={index} numColumns={2} className="px-8 py-4">
								<ListsItem listsItem={item} />
							</ColumnItem>
						)}
						numColumns={2}
						contentContainerClassName="w-full gap-4 px-4 pb-4 mt-3"
						estimatedItemSize={350}
					/>
				</TabsContent>
			</Tabs>
		</View>
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
