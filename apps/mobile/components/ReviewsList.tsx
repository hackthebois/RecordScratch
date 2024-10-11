import { RouterInputs } from "@recordscratch/api";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, View } from "react-native";
import { api } from "~/lib/api";
import { Review } from "./Review";
import React from "react";

export const ReviewsList = (
	input: RouterInputs["ratings"]["feed"] & { ListHeader?: React.ReactNode }
) => {
	const { ListHeader, ...queryInput } = input;
	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.useInfiniteQuery(
		{
			...queryInput,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	return (
		<FlashList
			ListHeaderComponent={() => ListHeader}
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
