import { RecentFeedReviews } from "@/components/InfiniteFeedReviews";
import { ScrollView } from "react-native";
import { View } from "react-native-ui-lib";

const FeedPage = () => {
	return (
		<ScrollView className="flex flex-1">
			<RecentFeedReviews input={{ limit: 3 }} />
		</ScrollView>
	);
};

export default FeedPage;
