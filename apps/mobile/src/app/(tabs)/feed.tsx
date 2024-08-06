import { useState } from "react";
import { View } from "react-native";
import { RecentFeedReviews } from "~/components/Infinite/InfiniteFeedReviews";
import { InfiniteFollowingReviews } from "~/components/Infinite/InfiniteFollowingReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

const FeedPage = () => {
	const [value, setValue] = useState("for-you");
	return (
		<Tabs value={value} onValueChange={setValue} className="flex-1">
			<View className="px-4">
				<TabsList className="flex-row w-full">
					<TabsTrigger value="for-you" className="flex-1">
						<Text>For You</Text>
					</TabsTrigger>
					<TabsTrigger value="friends" className="flex-1">
						<Text>Friends</Text>
					</TabsTrigger>
				</TabsList>
			</View>
			<TabsContent value="for-you" className="flex-1">
				<RecentFeedReviews input={{ limit: 5 }} />
			</TabsContent>
			<TabsContent value="friends" className="flex-1">
				<InfiniteFollowingReviews input={{ limit: 5 }} />
			</TabsContent>
		</Tabs>
	);
};

export default FeedPage;
