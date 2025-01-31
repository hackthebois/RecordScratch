import NotFoundScreen from "@/app/+not-found";
import StatBlock from "@/components/CoreComponents/StatBlock";
import AddToListButton from "@/components/List/AddToListButton";
import Metadata from "@/components/Metadata";
import RateButton from "@/components/Rating/RateButton";
import { RatingInfo } from "@/components/Rating/RatingInfo";
import SongTable from "@/components/SongTable";
import { WebWrapper } from "@/components/WebWrapper";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { getQueryOptions } from "@/lib/deezer";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlbumLayout() {
  const { albumId } = useLocalSearchParams<{ albumId: string }>();
  const id = albumId!;

  const [total] = api.ratings.count.useSuspenseQuery({
    resourceId: id,
    category: "ALBUM",
  });

  const { data: album } = useSuspenseQuery(
    getQueryOptions({
      route: "/album/{id}",
      input: { id },
    }),
  );

  if (!album) return <NotFoundScreen />;

  const { data: songs } = useSuspenseQuery({
    ...getQueryOptions({
      route: "/album/{id}/tracks",
      input: { id, limit: 1000 },
    }),
    initialData: {
      data: album?.tracks?.data ?? [],
    },
  });

  const resource: Resource = {
    parentId: String(album.artist?.id),
    resourceId: String(album.id),
    category: "ALBUM",
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <Stack.Screen
        options={{
          headerShown: Platform.OS !== "web",
        }}
      />
      <View className="flex flex-1">
        <ScrollView contentContainerClassName="pb-4">
          <WebWrapper>
            <Metadata
              title={album.title}
              type="ALBUM"
              cover={album.cover_big}
              tags={[
                album.release_date,
                album.duration
                  ? `${formatDuration(album.duration)}`
                  : undefined,
                ...(album.genres?.data.map(
                  (genre: { name: any }) => genre.name,
                ) ?? []),
              ]}
            >
              <Pressable
                onPress={() => {
                  router.navigate(`/artists/${album.artist?.id}`);
                }}
                style={{ maxWidth: "100%" }}
              >
                <Text className="text-muted-foreground">
                  {album.artist?.name}
                </Text>
              </Pressable>
              <View className="flex-row gap-4 my-4 items-center">
                <RatingInfo resource={resource} size="lg" />
                <RateButton
                  imageUrl={album.cover_big}
                  resource={resource}
                  name={album.title}
                />
                <AddToListButton
                  resourceId={String(album.id)}
                  parentId={String(album.artist?.id)}
                  category={"ALBUM"}
                />
              </View>
              <View className="flex-row w-full px-4 pb-4 sm:hidden">
                <Link href={`/albums/${album.id}/reviews`} asChild>
                  <Pressable className="flex-1">
                    <StatBlock title="Ratings" description={String(total)} />
                  </Pressable>
                </Link>
              </View>
            </Metadata>
            <SongTable
              songs={songs.data!.map((song) => ({ ...song, album }))}
            />
          </WebWrapper>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
