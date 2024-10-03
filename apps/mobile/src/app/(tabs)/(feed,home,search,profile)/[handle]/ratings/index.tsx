import NotFoundScreen from "#/app/+not-found";
import { Stack, useLocalSearchParams } from "expo-router";
import { ReviewsList } from "~/components/ReviewsList";
import { api } from "~/lib/api";

const Reviews = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);

	if (!profile) return <NotFoundScreen />;

	return (
		<>
			<Stack.Screen options={{ title: handle + " Ratings", headerBackVisible: true }} />
			<ReviewsList
				limit={20}
				filters={{
					profileId: profile.userId,
				}}
			/>
		</>
	);
};

export default Reviews;
