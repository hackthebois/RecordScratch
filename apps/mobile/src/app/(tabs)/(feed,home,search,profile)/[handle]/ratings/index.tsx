import NotFoundScreen from "#/app/+not-found";
import { Stack, useLocalSearchParams } from "expo-router";
import { ReviewsList } from "~/components/ReviewsList";
import { api } from "~/lib/api";

const Reviews = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);

	if (!profile) return <NotFoundScreen />;

	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.useInfiniteQuery(
		{
			limit: 5,
			filters: {
				profileId: profile.userId,
			},
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	return (
		<>
			<Stack.Screen options={{ title: handle + " Ratings", headerBackVisible: true }} />
			<ReviewsList
				pages={data?.pages}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
			/>
		</>
	);
};

export default Reviews;
