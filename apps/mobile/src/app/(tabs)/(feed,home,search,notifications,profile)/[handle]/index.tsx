import NotFoundScreen from "@/app/+not-found";
import StatBlock from "@/components/CoreComponents/StatBlock";
import DistributionChart from "@/components/DistributionChart";
import { FollowButton } from "@/components/Followers/FollowButton";
import ListOfLists from "@/components/List/ListOfLists";
import { TopList } from "@/components/List/TopList";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { ChevronRight, Eraser } from "@/lib/icons/IconsLoader";
import { Settings } from "@/lib/icons/IconsLoader";
import { getImageUrl } from "@/lib/image";
import { ListWithResources, ListsType, Profile } from "@recordscratch/types";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Suspense, useState } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";

const HandlePage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle);

	return <ProfilePage profile={profile} isProfile={false} />;
};

export const EditButton = ({ editMode, onPress }: { editMode: boolean; onPress: () => void }) => {
	return (
		<View className="flex items-center px-4">
			<Button
				className="w-full"
				variant={editMode ? "destructive" : "outline"}
				onPress={() => {
					onPress();
				}}
			>
				<Eraser size={20} className="text-foreground" />
			</Button>
		</View>
	);
};

const Lists = ({ handle, name, lists }: { handle: string; name: string; lists: ListsType[] }) => {
	return (
		<View className="px-4">
			<Link href={{ pathname: `/[handle]/lists`, params: { handle } }} asChild>
				<Button
					variant="outline"
					className="flex flex-row items-center justify-center pl-4"
				>
					<Text variant="h2">{name}'s Lists</Text>
					<ChevronRight />
				</Button>
			</Link>
			<View className="px-2">
				<ListOfLists lists={lists} orientation="horizontal" size={100} />
			</View>
		</View>
	);
};

const TopListsTab = ({
	album,
	song,
	artist,
	isProfile,
}: {
	album: ListWithResources | undefined;
	song: ListWithResources | undefined;
	artist: ListWithResources | undefined;
	isProfile: boolean;
}) => {
	const [value, setValue] = useState("albums");
	const [editMode, setEditMode] = useState(false);

	return (
		<View>
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
				<TabsContent
					value="albums"
					className="flex-row flex-wrap justify-between gap-2 p-4"
				>
					<TopList
						category="ALBUM"
						setEditMode={setEditMode}
						editMode={editMode}
						list={album}
						isUser={isProfile}
					/>
				</TabsContent>
				<TabsContent value="songs" className="flex-row flex-wrap justify-between gap-2 p-4">
					<TopList
						category="SONG"
						setEditMode={setEditMode}
						editMode={editMode}
						list={song}
						isUser={isProfile}
					/>
				</TabsContent>
				<TabsContent
					value="artists"
					className="flex-row flex-wrap justify-between gap-2 p-4"
				>
					<TopList
						category="ARTIST"
						setEditMode={setEditMode}
						editMode={editMode}
						list={artist}
						isUser={isProfile}
					/>
				</TabsContent>
			</Tabs>
			{isProfile && <EditButton editMode={editMode} onPress={() => setEditMode(!editMode)} />}
		</View>
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

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

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

	const [topLists] = api.lists.topLists.useSuspenseQuery({
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
				<TopListsTab {...topLists} isProfile={isProfile} />
				<Lists handle={profile.handle} name={profile.name} lists={lists} />
			</ScrollView>
		</View>
	);
};

export default HandlePage;
