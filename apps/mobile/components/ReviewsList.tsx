import { RouterInputs } from "@recordscratch/api";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, View } from "react-native";
import { api } from "~/lib/api";
import { Review } from "./Review";

export const ReviewsList = (input: RouterInputs["ratings"]["feed"]) => {
	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.useInfiniteQuery(
		{
			...input,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	return (
		<FlashList
			data={data?.pages?.flatMap((page) => page.items)}
			keyExtractor={(item, index) => `review-${item.userId}-${index}`}
			ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
			renderItem={({ item }) => <Review {...item} />}
			ListFooterComponent={() =>
				hasNextPage ? <ActivityIndicator size="large" color="#ff8500" /> : null
			}
			scrollEnabled={true}
			onEndReachedThreshold={0.1}
			onEndReached={() => {
				if (hasNextPage) {
					fetchNextPage();
				}
			}}
			estimatedItemSize={380}
		/>
	);
};
