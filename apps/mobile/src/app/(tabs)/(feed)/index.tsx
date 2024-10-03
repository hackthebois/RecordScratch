import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const FeedPage = () => {
	const [value, setValue] = useState("for-you");

	const {
		data: feed,
		fetchNextPage: feedNextPage,
		hasNextPage: feedHasNextPage,
	} = api.ratings.feed.useInfiniteQuery(
		{
			limit: 5,
			filters: {
				following: value === "friends",
			},
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	return (
		<>
			<Stack.Screen
				options={{
					title: "Feed",
				}}
			/>
			<Tabs value={value} onValueChange={setValue}>
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
			</Tabs>
			<ReviewsList
				pages={feed?.pages}
				fetchNextPage={feedNextPage}
				hasNextPage={feedHasNextPage}
			/>
		</>
	);
};

export default FeedPage;
