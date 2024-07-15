import { RecentFeedReviews } from "@/components/InfiniteFeedReviews";

const FeedPage = () => {
	return <RecentFeedReviews input={{ limit: 5 }} />;
};

export default FeedPage;
