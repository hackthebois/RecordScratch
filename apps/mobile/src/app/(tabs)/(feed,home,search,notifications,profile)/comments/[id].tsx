import NotFoundScreen from "@/app/+not-found";
import { Comment } from "@/components/Comment";
import { api } from "@/lib/api";
import { useRefreshByUser } from "@/lib/refresh";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const CommentPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();

	const [comment, { refetch }] = api.comments.get.useSuspenseQuery({
		id,
	});

	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

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
					refreshing={isRefetchingByUser}
					onRefresh={refetchByUser}
				/>
			</View>
		</>
	);
};
export default CommentPage;
