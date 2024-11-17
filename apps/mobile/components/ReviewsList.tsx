import { RouterInputs } from "@recordscratch/api";
import { ReviewType } from "@recordscratch/types";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { api } from "~/lib/api";
import { useRefreshByUser } from "~/lib/refresh";
import { Review } from "./Review";

export const ReviewsList = (
	input: RouterInputs["ratings"]["feed"] & {
		ListHeaderComponent?: FlashListProps<ReviewType>["ListHeaderComponent"];
	}
) => {
	const { ListHeaderComponent, ...queryInput } = input;
	const { data, fetchNextPage, hasNextPage, refetch } = api.ratings.feed.useInfiniteQuery(
		{
			...queryInput,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	const { refetchByUser, isRefetchingByUser } = useRefreshByUser(refetch);

	return (
		<FlashList
			ListHeaderComponent={ListHeaderComponent}
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
			refreshing={isRefetchingByUser}
			onRefresh={refetchByUser}
			estimatedItemSize={380}
		/>
	);
};
