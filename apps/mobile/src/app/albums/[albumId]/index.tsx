import NotFoundScreen from "#/app/+not-found";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { InfiniteCommunityReviews } from "~/components/Infinite/InfiniteCommunityReviews";
import Metadata from "~/components/Metadata";
import RatingDialog from "~/components/Rating/RatingDialog";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import SongTable from "~/components/SongTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

export default function AlbumLayout() {
	const [value, setValue] = useState("album");
	const { albumId } = useLocalSearchParams<{ albumId: string }>();
	const id = albumId!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id },
		})
	);

	if (!album) return <NotFoundScreen />;

	const [profile] = api.profiles.me.useSuspenseQuery();

	const { data: songs } = useSuspenseQuery({
		...getQueryOptions({
			route: "/album/{id}/tracks",
			input: { id, limit: 1000 },
		}),
		initialData: {
			data: album?.tracks?.data ?? [],
		},
	});

	console.log(songs);

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	return (
		<View className="flex flex-1">
			<Stack.Screen
				options={{
					headerTitle: () => <Text variant="h4">{album.title}</Text>,
				}}
			/>
			<ScrollView>
				<Metadata
					title={album.title}
					cover={album.cover_big}
					tags={[
						album.release_date,
						album.duration ? `${formatDuration(album.duration)}` : undefined,
						...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
					]}
				>
					<Pressable
						onPress={() => {
							router.push(`/artists/${album.artist?.id}`);
						}}
						style={{ maxWidth: "100%" }}
					>
						<Text className="text-muted-foreground">{album.artist?.name}</Text>
					</Pressable>
					<View className="flex-row gap-4 my-4">
						<RatingInfo resource={resource} size="lg" />
						<RatingDialog
							resource={resource}
							name={album.title}
							userId={profile!.userId}
						/>
					</View>
				</Metadata>
				<Tabs value={value} onValueChange={setValue}>
					<View className="px-4">
						<TabsList className="flex-row w-full">
							<TabsTrigger value="album" className="flex-1">
								<Text>Album</Text>
							</TabsTrigger>
							<TabsTrigger value="reviews" className="flex-1">
								<Text>Reviews</Text>
							</TabsTrigger>
						</TabsList>
					</View>
					<TabsContent value="album">
						<SongTable songs={songs.data?.map((song) => ({ ...song, album })) ?? []} />
					</TabsContent>
					<TabsContent value="reviews">
						<InfiniteCommunityReviews
							resource={resource}
							pageLimit={2}
							name={album.title}
						/>
					</TabsContent>
				</Tabs>
			</ScrollView>
		</View>
	);
}
