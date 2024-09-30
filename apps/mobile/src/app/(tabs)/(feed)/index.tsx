import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const FeedPage = () => {
	const [value, setValue] = useState("for-you");

	const {
		data: feed,
		fetchNextPage: feedNextPage,
		hasNextPage: feedHasNextPage,
	} = api.ratings.feed.recent.useInfiniteQuery(
		{
			limit: 5,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
			enabled: value === "for-you",
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
			<Stack.Screen
				options={{
					title: "Feed",
				}}
			/>
			<Tabs value={value} onValueChange={setValue} className="flex-1">
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="for-you" className="flex-1">
							<Text>For You</Text>
						</TabsTrigger>
						<TabsTrigger value="friends" className="flex-1">
							<Text>Friends</Text>
						</TabsTrigger>
					</TabsList>
				</View>
				<TabsContent value="for-you" className="flex-1">
					<ReviewsList
						pages={feed?.pages}
						fetchNextPage={feedNextPage}
						hasNextPage={feedHasNextPage}
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

export default FeedPage;
