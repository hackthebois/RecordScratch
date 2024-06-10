import { RecentFeedReviews } from "@/components/InfiniteFeedReviews";
import { View } from "react-native-ui-lib";

const Feed = () => {
	return (
		<View>
			<RecentFeedReviews input={{ limit: 20 }} />
		</View>
	);
};

export default Feed;
