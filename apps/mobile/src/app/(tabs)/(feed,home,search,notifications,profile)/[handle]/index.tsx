import NotFoundScreen from "@/app/+not-found";
import StatBlock from "@/components/CoreComponents/StatBlock";
import DistributionChart from "@/components/DistributionChart";
import { FollowButton } from "@/components/Followers/FollowButton";
import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import ListOfLists from "@/components/List/ListOfLists";
import { UserAvatar } from "@/components/UserAvatar";
import { WebWrapper } from "@/components/WebWrapper";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ChevronRight } from "@/lib/icons/IconsLoader";
import { Settings } from "@/lib/icons/IconsLoader";
import { getImageUrl } from "@/lib/image";
import {
  Category,
  ListWithResources,
  ListsType,
  Profile,
  listResourceType,
} from "@recordscratch/types";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Suspense, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";

const ListsTab = ({
  handle,
  lists,
  isProfile,
}: {
  handle: string;
  lists: ListsType[];
  isProfile: boolean;
}) => {
  return (
    <View className="px-2">
      <Link href={{ pathname: `/[handle]/lists`, params: { handle } }}>
        <View className=" w-full flex flex-row items-center p-2">
          <Text variant="h3">{isProfile ? "My" : `${handle}'s`} Lists</Text>
          <ChevronRight size={30} className=" color-muted-foreground" />
        </View>
      </Link>

      <ListOfLists lists={lists} orientation="horizontal" size={110} />
    </View>
  );
};

const TopList = ({
  category,
  list,
  isProfile,
}: {
  category: Category;
  list: ListWithResources | undefined;
  isProfile?: boolean;
}) => {
  const resources = list?.resources ?? [];
  const screenSize = Math.min(useWindowDimensions().width, 1024);
  const numColumns = screenSize === 1024 ? 6 : 3;
  const top6Width =
    (Math.min(screenSize, 1024) - 32 - (numColumns - 1) * 16) / numColumns;
  const router = useRouter();

  const renderAddButton = () => (
    <View className="flex flex-col items-center justify-center w-full gap-6 pt-5">
      <Text variant="h4" className="text-muted-foreground capitalize">
        Add Your Top 6 {category.toLocaleLowerCase() + "s"}
      </Text>
      <Button
        className="w-1/3"
        variant="outline"
        onPress={() => router.push(`/settings/editprofile`)}
      >
        <Text className="capitalize w-full text-center">
          Add {category.toLowerCase()}
        </Text>
      </Button>
    </View>
  );

  const renderResourceItem = (resource: listResourceType) => (
    <View
      className="relative h-auto overflow-hidden mt-4"
      key={resource.resourceId}
    >
      {category !== "ARTIST" ? (
        <ResourceItem
          resource={{
            parentId: resource.parentId!,
            resourceId: resource.resourceId,
            category,
          }}
          direction="vertical"
          titleCss={`font-medium line-clamp-2 text-center text-base`}
          showArtist={false}
          imageWidthAndHeight={top6Width}
          style={{ width: top6Width }}
        />
      ) : (
        <ArtistItem
          artistId={resource.resourceId}
          direction="vertical"
          textCss="font-medium line-clamp-2 text-center text-base"
          imageWidthAndHeight={top6Width}
          style={{ width: top6Width }}
        />
      )}
    </View>
  );

  return (
    <View className="flex flex-row flex-wrap gap-4 px-4">
      {resources.length === 0 && isProfile
        ? renderAddButton()
        : resources.map(renderResourceItem)}
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

  return (
    <>
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
        <TabsContent value="albums" className="mt-2">
          <TopList category="ALBUM" list={album} isProfile={isProfile} />
        </TabsContent>
        <TabsContent value="songs" className="mt-2">
          <TopList category="SONG" list={song} isProfile={isProfile} />
        </TabsContent>
        <TabsContent value="artists" className="mt-2">
          <TopList category="ARTIST" list={artist} isProfile={isProfile} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export const ProfilePage = ({ isProfile }: { isProfile: boolean }) => {
  let profile: Profile | null = null;
  if (isProfile) {
    profile = useAuth((s) => s.profile);
  } else {
    const { handle } = useLocalSearchParams<{ handle: string }>();
    [profile] = api.profiles.get.useSuspenseQuery(handle);
    isProfile = profile?.userId === useAuth((s) => s.profile?.userId);
  }
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
  const { data: values } = api.profiles.distribution.useQuery({
    userId: profile.userId,
  });
  const { data: totalRatings, isLoading: isLR } =
    api.profiles.getTotalRatings.useQuery({
      userId: profile.userId,
    });
  const { data: followerCount, isLoading: isLFRC } =
    api.profiles.followCount.useQuery({
      profileId: profile.userId,
      type: "followers",
    });
  const { data: followingCount, isLoading: isLFGC } =
    api.profiles.followCount.useQuery({
      profileId: profile.userId,
      type: "following",
    });

  const [topLists] = api.lists.topLists.useSuspenseQuery({
    userId: profile.userId,
  });

  const options =
    Platform.OS !== "web"
      ? {
          title: profile.name,
          headerRight: () =>
            isProfile ? (
              <Link href={`/settings`} className="p-2">
                <Settings size={22} className="text-foreground" />
              </Link>
            ) : (
              <Suspense fallback={null}>
                <FollowButton profileId={profile!.userId} size={"sm"} />
              </Suspense>
            ),
        }
      : {};

  return (
    <View className="flex flex-1">
      <Stack.Screen options={options} />
      <ScrollView>
        <WebWrapper>
          <View className="mt-4 px-4 gap-2">
            <View className="flex flex-col justify-start">
              <View className="flex flex-col items-center sm:items-start gap-4">
                <View className="flex-row gap-4">
                  <View className="hidden sm:flex">
                    <UserAvatar imageUrl={getImageUrl(profile)} size={144} />
                  </View>
                  <View className="flex sm:hidden">
                    <UserAvatar imageUrl={getImageUrl(profile)} size={100} />
                  </View>
                  <View className="items-start justify-center gap-3 flex-1">
                    <Text className="text-muted-foreground">PROFILE</Text>
                    <Text className="hidden sm:block" variant="h1">
                      {profile.name}
                    </Text>
                    <View className="flex flex-row flex-wrap items-center gap-3">
                      <Pill>{`@${profile.handle}`}</Pill>
                      <Pill>{`Streak: ${streak ?? ""}`}</Pill>
                      <Pill>{`Likes: ${likes ?? ""}`}</Pill>
                    </View>
                    <Text className="text-wrap truncate">
                      {profile.bio || "No bio yet"}
                    </Text>
                    {Platform.OS === "web" ? (
                      <>
                        {isProfile ? (
                          <Link href={`/settings`} asChild>
                            <Button
                              variant="secondary"
                              className="flex-row items-center"
                            >
                              <Settings
                                size={16}
                                className="mr-2 text-foreground"
                              />
                              <Text>Settings</Text>
                            </Button>
                          </Link>
                        ) : (
                          <Suspense fallback={null}>
                            <FollowButton
                              profileId={profile!.userId}
                              size={"sm"}
                            />
                          </Suspense>
                        )}
                      </>
                    ) : null}
                  </View>
                </View>
                <View className="flex flex-col items-center sm:items-start w-full">
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
            <View className="border border-border px-2 pt-3 rounded-xl">
              <DistributionChart
                distribution={values}
                height={80}
                onChange={(value) => {
                  router.push({
                    pathname: "/[handle]/ratings",
                    params: {
                      handle: profile!.handle,
                      rating: value ? String(value) : undefined,
                    },
                  });
                }}
              />
            </View>
          </View>
          <TopListsTab {...topLists} isProfile={isProfile} />
          <ListsTab
            handle={profile.handle}
            lists={lists}
            isProfile={isProfile}
          />
        </WebWrapper>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
