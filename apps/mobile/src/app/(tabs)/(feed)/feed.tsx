import { ReviewsList } from "@/components/ReviewsList";
import { WebWrapper } from "@/components/WebWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const FeedPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const tab = params.tab && params.tab !== "undefined" ? params.tab : "for-you";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feed",
        }}
      />
      <WebWrapper>
        <Tabs
          value={tab}
          onValueChange={() => {
            router.setParams({
              tab: tab === "friends" ? undefined : "friends",
            });
          }}
          className="sm:mt-4"
        >
          <View className="px-4">
            <TabsList className="flex-row w-full">
              <TabsTrigger value="for-you" className="flex-1">
                <Text>For You</Text>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex-1">
                <Text>Following</Text>
              </TabsTrigger>
            </TabsList>
          </View>
        </Tabs>
      </WebWrapper>
      <ReviewsList
        limit={20}
        filters={{
          following: tab === "friends",
          ratingType: "REVIEW",
        }}
        emptyText={
          tab === "friends"
            ? "No following reviews found. Follow some friends to see their reviews."
            : "No for you reviews found. Check back later."
        }
      />
    </>
  );
};

export default FeedPage;
