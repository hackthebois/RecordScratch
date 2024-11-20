import NotFoundScreen from "@/app/+not-found";
import StatBlock from "@/components/CoreComponents/StatBlock";
import DistributionChart from "@/components/DistributionChart";
import { FollowButton } from "@/components/Followers/FollowButton";
import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { UserAvatar } from "@/components/UserAvatar";
import { Pill } from "@/components/ui/pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Settings } from "@/lib/icons/Settings";
import { getImageUrl } from "@/lib/image";
import { ListWithResources, Profile } from "@recordscratch/types";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Suspense, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export const PrefetchProfile = (props: { handle?: string; userId?: string }) => {
	const profile = useAuth((s) => s.profile);
	const handle = props.handle ?? profile?.handle ?? "";
	const userId = props.userId ?? profile?.userId ?? "";

	api.profiles.get.usePrefetchQuery(handle);
	api.ratings.user.streak.usePrefetchQuery({ userId });
	api.ratings.user.totalLikes.usePrefetchQuery({ userId });
	api.profiles.distribution.usePrefetchQuery({ userId });
	api.lists.topLists.usePrefetchQuery({ userId });
	api.profiles.getTotalRatings.usePrefetchQuery({ userId });
	api.profiles.followCount.usePrefetchQuery({
		profileId: userId,
		type: "followers",
	});
	api.profiles.followCount.usePrefetchQuery({
		profileId: userId,
		type: "following",
	});

	return null;
};

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle);

	return <ProfilePage profile={profile} isProfile={false} />;
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
						textCss="font-medium"
					/>
				))}
			</TabsContent>
		</Tabs>
	);
};

export const ProfilePage = ({
	profile,
	isProfile,
}: {
	profile: Profile | null;
	isProfile: boolean;
}) => {
	const router = useRouter();

	if (!profile) return <NotFoundScreen />;

	// const [lists] = api.lists.getUser.useSuspenseQuery({
	// 	userId: profile.userId,
	// });

	const { data: streak } = api.ratings.user.streak.useQuery({
		userId: profile.userId,
	});
	const { data: likes } = api.ratings.user.totalLikes.useQuery({
		userId: profile.userId,
	});
	const { data: values } = api.profiles.distribution.useQuery({ userId: profile.userId });
	const { data: totalRatings, isLoading: isLR } = api.profiles.getTotalRatings.useQuery({
		userId: profile.userId,
	});
	const { data: followerCount, isLoading: isLFRC } = api.profiles.followCount.useQuery({
		profileId: profile.userId,
		type: "followers",
	});
	const { data: followingCount, isLoading: isLFGC } = api.profiles.followCount.useQuery({
		profileId: profile.userId,
		type: "following",
	});
	const { data: topLists } = api.lists.topLists.useQuery({
		userId: profile.userId,
	});

	return (
		<View className="flex flex-1">
			<Stack.Screen
				options={{
					title: profile.name,
					headerRight: () =>
						isProfile ? (
							<Link href={`/settings`} className="p-2">
								<Settings size={22} className="mr-2 text-foreground" />
							</Link>
						) : (
							<Suspense fallback={null}>
								<FollowButton profileId={profile.userId} size={"sm"} />
							</Suspense>
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
									<View className="flex flex-row flex-wrap items-center gap-3">
										<Pill>{`@${profile.handle}`}</Pill>
										<Pill>{`Streak: ${streak ?? ""}`}</Pill>
										<Pill>{`Likes: ${likes ?? ""}`}</Pill>
									</View>
									<Text className="text-wrap truncate">
										{profile.bio || "No bio yet"}
									</Text>
								</View>
							</View>
							<View className="flex flex-col items-center">
								<View className="flex flex-row w-full gap-2">
									<Link href={`/${profile.handle}/ratings`} asChild>
										<Pressable className="flex-1">
											<StatBlock
												title={"Ratings"}
												description={String(totalRatings)}
												size="sm"
												loading={isLR}
											/>
										</Pressable>
									</Link>
									<Link href={`/${profile.handle}/followers`} asChild>
										<Pressable className="flex-1">
											<StatBlock
												title={"Followers"}
												description={String(followerCount)}
												size="sm"
												loading={isLFRC}
											/>
										</Pressable>
									</Link>
									<Link
										href={`/${profile.handle}/followers?type=following`}
										asChild
									>
										<Pressable className="flex-1">
											<StatBlock
												title={"Following"}
												description={String(followingCount)}
												size="sm"
												loading={isLFGC}
											/>
										</Pressable>
									</Link>
								</View>
							</View>
						</View>
					</View>
					<Link href={`/${profile.handle}/ratings`} asChild>
						<Pressable className="border border-border px-2 pt-1 rounded-xl">
							<DistributionChart
								distribution={values}
								height={80}
								onChange={(value) => {
									router.push({
										pathname: "/[handle]/ratings",
										params: {
											handle: profile.handle,
											rating: value ? String(value) : undefined,
										},
									});
								}}
							/>
						</Pressable>
					</Link>
				</View>
				<TopListsTab
					{...(topLists ?? {
						album: undefined,
						song: undefined,
						artist: undefined,
					})}
				/>
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
