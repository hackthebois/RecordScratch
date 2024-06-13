import { View, ActivityIndicator, FlatList, Text } from "react-native";
import { api } from "@/utils/api";
import { Review } from "./Review";
import { Resource } from "@recordscratch/types";

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
		<View style={{ flex: 1 }}>
			<FlatList
				data={data?.pages.flatMap((page) => page.items)}
				keyExtractor={(item, index) => `review-${item.userId}-${index}`}
				renderItem={({ item }) => (
					<View className="my-3">
						<Review {...item} />
					</View>
				)}
				ListFooterComponent={() =>
					hasNextPage ? <ActivityIndicator size="large" /> : null
				}
				onEndReachedThreshold={0.1}
				onEndReached={handleLoadMore}
				contentContainerStyle={{ flexGrow: 1, padding: 10 }}
				ListEmptyComponent={<Text>No reviews available</Text>}
				className=" h-screen"
			/>
		</View>
	);
};
