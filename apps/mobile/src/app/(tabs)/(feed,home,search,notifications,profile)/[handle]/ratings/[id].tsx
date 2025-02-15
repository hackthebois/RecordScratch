import NotFoundScreen from "@/app/+not-found";
import { Comment } from "@/components/Comment";
import { Review } from "@/components/Review";
import { WebWrapper } from "@/components/WebWrapper";
import { api } from "@/lib/api";
import { useRefreshByUser } from "@/lib/refresh";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const RatingPage = () => {
	const { id, handle } = useLocalSearchParams<{
		id: string;
		handle: string;
	}>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle!);

	const [rating] = api.ratings.user.get.useSuspenseQuery({
		userId: profile!.userId,
		resourceId: id!,
	});
	const [comments, { refetch }] = api.comments.list.useSuspenseQuery({
		resourceId: id!,
		authorId: profile!.userId,
	});

	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

	if (!profile || !rating) return <NotFoundScreen />;

	return (
		<>
			<Stack.Screen
				options={{
					title: `${profile.name}'s Rating`,
				}}
			/>
			<View className="flex-1">
				<FlashList
					ListHeaderComponent={
						<WebWrapper>
							<Review {...rating} profile={profile} />
							<View className="bg-muted h-[1px]" />
						</WebWrapper>
					}
					data={comments}
					renderItem={({ item }) => (
						<WebWrapper>
							<Comment comment={item} />
						</WebWrapper>
					)}
					ItemSeparatorComponent={() => (
						<WebWrapper>
							<View className="bg-muted h-[1px]" />
						</WebWrapper>
					)}
					estimatedItemSize={200}
					refreshing={isRefetchingByUser}
					onRefresh={refetchByUser}
				/>
			</View>
		</>
	);
};
export default RatingPage;
