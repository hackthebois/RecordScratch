import DistributionChart from "@/components/DistributionChart";
import { ReviewsList } from "@/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { getQueryOptions } from "@/lib/deezer";
import { Resource } from "@recordscratch/types";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

const tabs = ["everyone", "friends"];
const ratingTabs = ["REVIEW", "RATING", "all"];

const Reviews = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    albumId: string;
    songId: string;
    tab?: string;
    ratingTab?: string;
    ratingFilter?: string;
  }>();
  const { albumId, songId } = params;
  const tab = params.tab && tabs.includes(params.tab) ? params.tab : "everyone";
  const ratingTab = (
    params.ratingTab && ratingTabs.includes(params.ratingTab)
      ? params.ratingTab
      : "all"
  ) as "REVIEW" | "RATING" | "all";
  const ratingFilter =
    params.ratingFilter && params.ratingFilter !== "undefined"
      ? Number(params.ratingFilter)
      : undefined;

  const { data: song } = useSuspenseQuery(
    getQueryOptions({
      route: "/track/{id}",
      input: { id: songId! },
    }),
  );

  const { data: values } = api.ratings.distribution.useQuery(
    {
      resourceId: songId,
      filters: {
        reviewType: ratingTab === "all" ? undefined : ratingTab,
        following: tab === "friends",
      },
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  useEffect(() => {
    if (values && ratingFilter && values[ratingFilter - 1] === 0) {
      router.setParams({
        ratingFilter: undefined,
      });
    }
  }, [values]);

  const resource: Resource = {
    parentId: String(albumId),
    resourceId: String(songId),
    category: "SONG",
  };

  return (
    <>
      <Stack.Screen
        options={{ title: song.title + " Ratings", headerBackVisible: true }}
      />
      <Tabs
        value={tab}
        onValueChange={(value) => {
          router.setParams({ tab: value === "everyone" ? undefined : value });
        }}
      >
        <View className="px-4">
          <TabsList className="flex-row w-full">
            <TabsTrigger value="everyone" className="flex-1">
              <Text>Everyone</Text>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex-1">
              <Text>Friends</Text>
            </TabsTrigger>
          </TabsList>
        </View>
      </Tabs>
      <ReviewsList
        filters={{
          following: tab === "friends",
          resourceId: resource.resourceId,
          category: resource.category,
          rating: ratingFilter,
          ratingType: ratingTab === "all" ? undefined : ratingTab,
        }}
        limit={20}
        ListHeaderComponent={
          <>
            <View className="p-4">
              <DistributionChart
                distribution={values}
                value={ratingFilter}
                onChange={(value) => {
                  router.setParams({
                    ratingFilter: value,
                  });
                }}
              />
            </View>
            <Tabs
              value={ratingTab}
              onValueChange={(value) => {
                console.log(value, value !== ratingTab);
                value !== ratingTab
                  ? router.setParams({ ratingTab: value })
                  : router.setParams({ ratingTab: undefined });
              }}
            >
              <View className="px-4">
                <TabsList className="flex-row w-full">
                  <TabsTrigger value="REVIEW" className="flex-1">
                    <Text>Reviews</Text>
                  </TabsTrigger>
                  <TabsTrigger value="RATING" className="flex-1">
                    <Text>Ratings</Text>
                  </TabsTrigger>
                </TabsList>
              </View>
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default Reviews;
