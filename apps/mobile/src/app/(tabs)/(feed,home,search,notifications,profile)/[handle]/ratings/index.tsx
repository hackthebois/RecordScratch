import NotFoundScreen from "@/app/+not-found";
import DistributionChart from "@/components/DistributionChart";
import { ReviewsList } from "@/components/ReviewsList";
import { WebWrapper } from "@/components/WebWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { keepPreviousData } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

type RatingCategory = "all" | "ALBUM" | "SONG";

const Reviews = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    handle: string;
    rating?: string;
    tab?: string;
  }>();
  const handle = params.handle;
  const rating =
    params.rating && params.rating !== "undefined"
      ? parseInt(params.rating)
      : undefined;
  const tab = (
    params.tab && params.tab !== "undefined" ? params.tab : "all"
  ) as RatingCategory;
  const [profile] = api.profiles.get.useSuspenseQuery(handle);

  const { data: values } = api.profiles.distribution.useQuery(
    { userId: profile!.userId, category: tab !== "all" ? tab : undefined },
    {
      enabled: !!profile,
      placeholderData: keepPreviousData,
    },
  );

  useEffect(() => {
    if (values && rating && values[rating - 1] === 0) {
      router.setParams({
        rating: undefined,
      });
    }
  }, [values]);

  if (!profile) return <NotFoundScreen />;

  return (
    <>
      <Stack.Screen
        options={{
          title: handle + " Ratings",
        }}
      />
      <ReviewsList
        limit={20}
        filters={{
          profileId: profile.userId,
          category: tab !== "all" ? tab : undefined,
          rating,
        }}
        ListHeaderComponent={
          <WebWrapper>
            <View className="p-4">
              <DistributionChart
                distribution={values}
                value={rating}
                onChange={(rating) => {
                  router.setParams({
                    rating,
                  });
                }}
              />
            </View>
            <Tabs
              value={tab}
              onValueChange={(value) =>
                value !== tab
                  ? router.setParams({ tab: value as RatingCategory })
                  : router.setParams({ tab: "all" })
              }
            >
              <View className="px-4">
                <TabsList className="flex-row w-full">
                  <TabsTrigger value="ALBUM" className="flex-1">
                    <Text>Albums</Text>
                  </TabsTrigger>
                  <TabsTrigger value="SONG" className="flex-1">
                    <Text>Songs</Text>
                  </TabsTrigger>
                </TabsList>
              </View>
            </Tabs>
          </WebWrapper>
        }
      />
    </>
  );
};

export default Reviews;
