import NotFoundScreen from "#/app/+not-found";
import { timeAgo } from "@recordscratch/lib";
import { FlashList } from "@shopify/flash-list";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Review } from "~/components/Review";
import { UserAvatar } from "~/components/UserAvatar";
import { Text } from "~/components/ui/text";
import { RouterOutputs, api } from "~/lib/api";
import { getImageUrl } from "~/lib/image";

export const Comment = ({
	comment: { content, profile, updatedAt },
}: {
	comment: RouterOutputs["comments"]["list"][0];
}) => {
	return (
		<View className="p-4 gap-4">
			<Link href={`/${String(profile.handle)}`} asChild>
				<Pressable className="flex flex-row flex-wrap items-center gap-2">
					<UserAvatar size={40} imageUrl={getImageUrl(profile)} />
					<Text className="text-lg">{profile.name}</Text>
					<Text className="text-left text-muted-foreground text-lg">
						@{profile.handle} • {timeAgo(updatedAt)}
					</Text>
				</Pressable>
			</Link>
			<Text className="text-lg">{content}</Text>
		</View>
	);
};

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
			<Stack.Screen options={{ headerTitle: `${profile.name}'s Rating` }} />
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
