import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";
import { Review } from "~/components/Review";
import { api } from "~/lib/api";
import { RouterInputs } from "~/lib/shared";

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
		<FlashList
			data={data?.pages.flatMap((page) => page.items)}
			keyExtractor={(item, index) => `review-${item.userId}-${index}`}
			ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
			renderItem={({ item }) => <Review {...item} />}
			ListFooterComponent={() => (hasNextPage ? <ActivityIndicator size="large" /> : null)}
			scrollEnabled={true}
			onEndReachedThreshold={0.1}
			onEndReached={handleLoadMore}
			ListEmptyComponent={<Text>No reviews available</Text>}
			estimatedItemSize={380}
		/>
	);
};
