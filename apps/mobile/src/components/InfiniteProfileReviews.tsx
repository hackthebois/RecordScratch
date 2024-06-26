import { View, ActivityIndicator, FlatList, Text, ScrollView } from "react-native";
import { RouterInputs, api } from "@/utils/api";
import { Review } from "./Review";

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
		<View style={{ flex: 1 }}>
			<FlatList
				data={data?.pages.flatMap((page) => page.items)}
				keyExtractor={(item, index) => `review-${item.userId}-${index}`}
				renderItem={({ item }) => (
					<View className="my-0.5">
						<Review {...item} />
					</View>
				)}
				ListFooterComponent={() =>
					hasNextPage ? <ActivityIndicator size="large" /> : null
				}
				scrollEnabled={false}
				onEndReachedThreshold={0.7}
				onEndReached={handleLoadMore}
				contentContainerStyle={{ padding: 4, flexGrow: 1 }}
				ListEmptyComponent={<Text>No reviews available</Text>}
			/>
		</View>
	);
};
