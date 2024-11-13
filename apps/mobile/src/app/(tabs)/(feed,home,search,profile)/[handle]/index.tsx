import NotFoundScreen from "#/app/+not-found";
import { ListWithResources } from "@recordscratch/types";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import DistributionChart from "~/components/DistributionChart";
import { FollowButton } from "~/components/Followers/FollowButton";
import FollowerMenu from "~/components/Followers/FollowersMenu";
import { ArtistItem } from "~/components/Item/ArtistItem";
import { ResourceItem } from "~/components/Item/ResourceItem";
import { UserAvatar } from "~/components/UserAvatar";
import { Pill } from "~/components/ui/pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Settings } from "~/lib/icons/Settings";
import { getImageUrl } from "~/lib/image";

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	return <ProfilePage handle={handle!} />;
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

export const ProfilePage = ({ handle }: { handle: string }) => {
	const myProfile = useAuth((s) => s.profile);
	const router = useRouter();

	const [profile] = api.profiles.get.useSuspenseQuery(handle);

	if (!profile) return <NotFoundScreen />;

	const isProfile = myProfile?.userId === profile.userId;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	// const [lists] = api.lists.getUser.useSuspenseQuery({
	// 	userId: profile.userId,
	// });

	const [streak] = api.ratings.user.streak.useSuspenseQuery({
		userId: profile.userId,
	});
	const [likes] = api.ratings.user.totalLikes.useSuspenseQuery({
		userId: profile.userId,
	});
	const [values] = api.profiles.distribution.useSuspenseQuery({ userId: profile!.userId });

	const tags = [`@${profile.handle}`, `Streak: ${streak}`, `Likes: ${likes}`];

	return (
		<View className="flex flex-1">
			<Stack.Screen
				options={{
					title: profile.name,
					headerRight: () =>
						isProfile ? (
							<Link href={`/settings`}>
								<Settings size={22} className="mr-6 text-foreground" />
							</Link>
						) : (
							<FollowButton profileId={profile.userId} size={"sm"} />
						),
				}}
			/>
			<ScrollView>
				<View className="mt-4 px-4 gap-2">
					<View className="flex flex-col justify-start">
						<View className="flex flex-col items-center gap-4">
							<View className="flex-row gap-4">
								<UserAvatar imageUrl={getImageUrl(profile)} size={100} />
								<View className="items-start justify-center gap-3 flex-1">
									<View className="flex flex-row flex-wrap justify-center gap-3 sm:justify-start">
										{tags
											.filter((tag) => Boolean(tag))
											.map((tag, index) => (
												<Pill key={index}>{tag}</Pill>
											))}
									</View>
									<Text className="text-wrap truncate">
										{profile.bio || "No bio yet"}
									</Text>
								</View>
							</View>
							<FollowerMenu profileId={profile.userId} handleId={profile.handle} />
						</View>
					</View>
					<View className="bg-secondary px-2 pt-1 rounded-xl">
						<DistributionChart
							distribution={values}
							height={80}
							onChange={(value) => {
								router.push({
									pathname: `/${profile.handle}/ratings`,
									params: {
										rating: value ? String(value) : undefined,
									},
								});
							}}
						/>
					</View>
				</View>
				<TopListsTab {...topLists} />
				{/* <FlashList
						data={lists}
						renderItem={({ index, item }) => (
							<ColumnItem index={index} numColumns={2} className="px-8 py-4">
								<ListsItem listsItem={item} />
							</ColumnItem>
						)}
						numColumns={2}
						contentContainerClassName="w-full gap-4 px-4 pb-4 mt-3"
						estimatedItemSize={350}
					/> */}
			</ScrollView>
		</View>
	);
};

export default HandlePage;
