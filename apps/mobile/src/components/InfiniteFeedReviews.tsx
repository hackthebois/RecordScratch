import { useEffect } from "react";
import { View, ActivityIndicator, FlatList, Text } from "react-native";
import { api } from "@/utils/api";
import { RouterInputs } from "@/utils/shared";
import { Review } from "./Review";

export const RecentFeedReviews = ({
	input,
}: {
	input?: RouterInputs["ratings"]["feed"]["recent"];
}) => {
	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.recent.useInfiniteQuery(
		{
			...input,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	const handleLoadMore = () => {
		if (hasNextPage) {
			fetchNextPage();
		}
	};

	return (
		<FlatList
			data={data?.pages.flatMap((page) => page.items)}
			keyExtractor={(item, index) => `review-${item.userId}-${index}`}
			renderItem={({ item }) => (
				<View className="my-1">
					<Review {...item} />
				</View>
			)}
			ListFooterComponent={() => (hasNextPage ? <ActivityIndicator size="large" /> : null)}
			scrollEnabled={true}
			onEndReachedThreshold={0.1}
			onEndReached={handleLoadMore}
			contentContainerStyle={{ padding: 4 }}
			ListEmptyComponent={<Text>No reviews available</Text>}
			className=" h-screen"
		/>
	);
};
