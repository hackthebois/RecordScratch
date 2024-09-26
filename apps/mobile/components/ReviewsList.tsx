import { ReviewType } from "@recordscratch/types";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, View } from "react-native";
import { Review } from "./Review";

export const ReviewsList = ({
	pages,
	hasNextPage,
	fetchNextPage,
	ListHeaderComponent,
}: {
	pages?: {
		items: ReviewType[];
	}[];
	hasNextPage: boolean;
	fetchNextPage: () => void;
	ListHeaderComponent?: JSX.Element;
}) => {
	return (
		<FlashList
			data={pages?.flatMap((page) => page.items)}
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
			ListHeaderComponent={ListHeaderComponent}
		/>
	);
};
