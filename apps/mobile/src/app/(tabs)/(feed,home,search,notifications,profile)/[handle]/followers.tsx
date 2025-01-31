import NotFoundScreen from "@/app/+not-found";
import { ProfileItem } from "@/components/Item/ProfileItem";
import { WebWrapper } from "@/components/WebWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRefreshByUser } from "@/lib/refresh";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { useState } from "react";
import { Platform, View } from "react-native";

const Followers = () => {
  const { handle, type } = useLocalSearchParams<{
    handle: string;
    type: string;
  }>();
  const [tab, setTab] = useState(type ?? "followers");
  const profile = useAuth((s) => s.profile);

  const [userProfile] = api.profiles.get.useSuspenseQuery(handle);

  if (!userProfile) return <NotFoundScreen />;

  const { data: followProfiles, refetch } =
    api.profiles.followProfiles.useQuery({
      profileId: userProfile.userId,
      type: tab === "followers" ? "followers" : "following",
    });

  const { refetchByUser, isRefetchingByUser } = useRefreshByUser(refetch);

  return (
    <>
      <Stack.Screen
        options={{
          title: tab === "followers" ? "Followers" : "Following",
          headerBackVisible: true,
          headerShown: Platform.OS !== "web",
        }}
      />
      <Tabs value={tab} onValueChange={setTab} className="flex-1 sm:mt-4">
        <WebWrapper>
          <View className="w-full px-4">
            <TabsList className="flex-row">
              <TabsTrigger value="followers" className="flex-1">
                <Text>Followers</Text>
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                <Text>Following</Text>
              </TabsTrigger>
            </TabsList>
          </View>
        </WebWrapper>
        <FlashList
          data={followProfiles?.flatMap((item) => item.profile)}
          renderItem={({ item }) => (
            <WebWrapper>
              <ProfileItem
                profile={item}
                isUser={profile!.userId === item.userId}
              />
            </WebWrapper>
          )}
          estimatedItemSize={60}
          ItemSeparatorComponent={() => <View className="h-3" />}
          className="px-4"
          contentContainerClassName="py-4"
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
        />
      </Tabs>
    </>
  );
};

export default Followers;
