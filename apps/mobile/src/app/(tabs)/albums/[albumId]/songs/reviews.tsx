import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

const Reviews = () => {
	const [value, setValue] = useState("for-you");
	const { albumId, songId } = useLocalSearchParams<{ albumId: string; songId: string }>();

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId! },
		})
	);

	const { data: song } = useSuspenseQuery(
		getQueryOptions({
			route: "/track/{id}",
			input: { id: songId! },
		})
	);

	const resource: Resource = {
		parentId: String(albumId),
		resourceId: String(songId),
		category: "SONG",
	};

	const {
		data: all,
		fetchNextPage: allNextPage,
		hasNextPage: allHasNextPage,
	} = api.ratings.feed.community.useInfiniteQuery(
		{
			limit: 5,
			resource,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	const {
		data: following,
		fetchNextPage: followingNextPage,
		hasNextPage: followingHasNextPage,
	} = api.ratings.feed.following.useInfiniteQuery(
		{
			limit: 5,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
			enabled: value === "friends",
		}
	);

	return (
		<>
			<Stack.Screen options={{ title: song.title + " Reviews", headerBackVisible: true }} />
			<Tabs value={value} onValueChange={setValue} className="flex-1">
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="for-you" className="flex-1">
							<Text>Everyone</Text>
						</TabsTrigger>
						<TabsTrigger value="friends" className="flex-1">
							<Text>Friends</Text>
						</TabsTrigger>
					</TabsList>
				</View>
				<TabsContent value="for-you" className="flex-1">
					<ReviewsList
						pages={all?.pages}
						fetchNextPage={allNextPage}
						hasNextPage={allHasNextPage}
					/>
				</TabsContent>
				<TabsContent value="friends" className="flex-1">
					<ReviewsList
						pages={following?.pages}
						fetchNextPage={followingNextPage}
						hasNextPage={followingHasNextPage}
					/>
				</TabsContent>
			</Tabs>
		</>
	);
};

export default Reviews;
