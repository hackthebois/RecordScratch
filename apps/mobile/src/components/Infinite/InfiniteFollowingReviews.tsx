import { View, ActivityIndicator, Text } from "react-native";
import { api } from "#/utils/api";
import { RouterInputs } from "#/utils/shared";
import { Review } from "#/components/Review";
import { FlashList } from "@shopify/flash-list";
import { Tabs } from "react-native-collapsible-tab-view";

export const InfiniteFollowingReviews = ({
	input,
}: {
	input?: RouterInputs["ratings"]["feed"]["following"];
}) => {
	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.following.useInfiniteQuery(
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
			estimatedItemSize={380}
		/>
	);
};
