import { View, ActivityIndicator, Text } from "react-native";
import { api } from "~/lib/api";
import { RouterInputs } from "~/lib/shared";
import { Review } from "~/components/Review";
import { Tabs } from "react-native-collapsible-tab-view";

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
		<Tabs.FlashList
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
			className="h-screen"
			estimatedItemSize={380}
		/>
	);
};
