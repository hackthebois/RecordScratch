import { RecentFeedReviews } from "@/components/InfiniteFeedReviews";
import { View } from "react-native-ui-lib";

const FeedPage = () => {
	return (
		<View className="flex flex-1">
			<RecentFeedReviews input={{ limit: 5 }} />
		</View>
	);
};

export default FeedPage;
