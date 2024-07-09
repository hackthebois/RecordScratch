import { RecentFeedReviews } from "@/components/InfiniteFeedReviews";
import { ScrollView } from "react-native";
import { View } from "react-native-ui-lib";

const FeedPage = () => {
	return <RecentFeedReviews input={{ limit: 3 }} />;
};

export default FeedPage;
