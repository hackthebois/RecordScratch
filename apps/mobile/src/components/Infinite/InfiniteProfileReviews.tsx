import { View, ActivityIndicator, Text } from "react-native";
import { RouterInputs, api } from "#/utils/api";
import { Review } from "#/components/Review";
import { useEffect, useState } from "react";
import { FlashList } from "react-native-collapsible-tab-view";
import { Tabs } from "react-native-collapsible-tab-view";

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

	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		if (isInitialLoad && data) {
			setIsInitialLoad(false);
		}
	}, [data]);

	const handleLoadMore = () => {
		if (hasNextPage) {
			fetchNextPage();
		}
	};

	return (
		<Tabs.FlatList
			data={data?.pages.flatMap((page) => page.items)}
			keyExtractor={(item, index) => `review-${item.userId}-${index}`}
			renderItem={({ item }) => (
				<View className="my-0.5">
					<Review {...item} />
				</View>
			)}
			ListFooterComponent={() => (hasNextPage ? <ActivityIndicator size="large" /> : null)}
			onEndReachedThreshold={1}
			onEndReached={handleLoadMore}
			contentContainerStyle={{ padding: 4 }}
			ListEmptyComponent={<Text>No reviews available</Text>}
		/>
	);
};
