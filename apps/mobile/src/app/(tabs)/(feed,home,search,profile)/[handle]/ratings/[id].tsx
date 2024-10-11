import NotFoundScreen from "#/app/+not-found";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Comment } from "~/components/Comment";
import { Review } from "~/components/Review";
import { api } from "~/lib/api";

const RatingPage = () => {
	const { id, handle } = useLocalSearchParams<{ id: string; handle: string }>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle!);

	const [rating] = api.ratings.user.get.useSuspenseQuery({
		userId: profile!.userId,
		resourceId: id!,
	});
	const [comments] = api.comments.list.useSuspenseQuery({
		resourceId: id!,
		authorId: profile!.userId,
	});

	if (!profile || !rating) return <NotFoundScreen />;

	return (
		<>
			<Stack.Screen options={{ title: `${profile.name}'s Rating` }} />
			<View className="flex-1">
				<FlashList
					ListHeaderComponent={
						<>
							<Review {...rating} profile={profile} />
							<View className="h-1 bg-muted" />
						</>
					}
					data={comments}
					renderItem={({ item }) => <Comment comment={item} />}
					ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
					estimatedItemSize={200}
				/>
			</View>
		</>
	);
};
export default RatingPage;
