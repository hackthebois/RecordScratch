import { Resource } from "@recordscratch/types";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";
import { Review } from "~/components/Review";
import { api } from "~/lib/api";

export const InfiniteCommunityReviews = ({
	pageLimit,
	resource,
	name,
}: {
	pageLimit: number;
	resource: Resource;
	name: string;
}) => {
	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.community.useInfiniteQuery(
		{
			limit: pageLimit,
			resource,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	const handleLoadMore = () => {
		if (hasNextPage) {
			fetchNextPage();
		}
	};

	return (
		<FlashList
			data={data?.pages.flatMap((page) => page.items)}
			keyExtractor={(item, index) => `review-${item.userId}-${index}`}
			renderItem={({ item }) => <Review {...item} />}
			ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
			ListFooterComponent={() => (hasNextPage ? <ActivityIndicator size="large" /> : null)}
			onEndReachedThreshold={0.1}
			onEndReached={handleLoadMore}
			estimatedItemSize={380}
			scrollEnabled={true}
			ListEmptyComponent={<Text>No reviews available</Text>}
		/>
	);
};
