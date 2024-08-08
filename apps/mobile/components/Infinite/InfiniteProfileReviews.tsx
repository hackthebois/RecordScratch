import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";
import { Review } from "~/components/Review";
import { RouterInputs, api } from "~/lib/api";

export const InfiniteProfileReviews = ({
	input,
}: {
	input: RouterInputs["ratings"]["user"]["recent"];
}) => {
	const { data, fetchNextPage, hasNextPage } = api.ratings.user.recent.useInfiniteQuery(
		{
			...input,
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
			scrollEnabled={true}
			onEndReachedThreshold={0.1}
			onEndReached={handleLoadMore}
			ListEmptyComponent={<Text>No reviews available</Text>}
			estimatedItemSize={380}
		/>
	);
};
