import { RecentFeedReviews } from "#/components/Infinite/InfiniteFeedReviews";
import { InfiniteFollowingReviews } from "#/components/Infinite/InfiniteFollowingReviews";
import { Dimensions } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";

const FeedPage = () => {
	return (
		<Tabs.Container
			renderTabBar={(props) => (
				<MaterialTabBar
					{...props}
					contentContainerStyle={{
						flexDirection: "row",
						justifyContent: "space-around",
						paddingLeft: 16,
						paddingRight: 16,
						paddingEnd: 16,
					}}
					labelStyle={{ fontSize: 16 }}
					indicatorStyle={{
						left: (Dimensions.get("window").width / 2 - 225) / 2,
						backgroundColor: "orange",
					}}
				/>
			)}
		>
			<Tabs.Tab name="For You">
				<></>
				<RecentFeedReviews input={{ limit: 5 }} />
			</Tabs.Tab>
			<Tabs.Tab name="Friends">
				<></>
				<InfiniteFollowingReviews input={{ limit: 5 }} />
			</Tabs.Tab>
		</Tabs.Container>
	);
};

export default FeedPage;
