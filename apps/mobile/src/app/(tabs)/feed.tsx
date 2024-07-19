import { RecentFeedReviews } from "#/components/Infinite/InfiniteFeedReviews";

const FeedPage = () => {
	return <RecentFeedReviews input={{ limit: 5 }} />;
};

export default FeedPage;
