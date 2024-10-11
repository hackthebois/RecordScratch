import NotFoundScreen from "#/app/+not-found";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Comment } from "~/components/Comment";
import { api } from "~/lib/api";

const CommentPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();

	const [comment] = api.comments.get.useSuspenseQuery({
		id,
	});

	if (!comment) return <NotFoundScreen />;

	return (
		<>
			<Stack.Screen options={{ title: `${comment.profile.name}'s Comment` }} />
			<View className="flex-1">
				<FlashList
					ListHeaderComponent={
						<>
							<Comment comment={comment} />
							<View className="h-1 bg-muted" />
						</>
					}
					data={comment.replies}
					renderItem={({ item }) => <Comment comment={item} />}
					ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
					estimatedItemSize={200}
				/>
			</View>
		</>
	);
};
export default CommentPage;
