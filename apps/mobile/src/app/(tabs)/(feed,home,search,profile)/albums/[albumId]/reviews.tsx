import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

const Reviews = () => {
	const { albumId } = useLocalSearchParams<{ albumId: string }>();
	const [tab, setTab] = useState("everyone");
	const id = albumId!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id },
		})
	);

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.useInfiniteQuery(
		{
			limit: 5,
			filters: {
				following: tab === "friends",
				resourceId: resource.resourceId,
				category: resource.category,
			},
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	return (
		<View className="flex-1">
			<Stack.Screen options={{ title: album.title + " Reviews" }} />
			<Tabs value={tab} onValueChange={setTab}>
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="everyone" className="flex-1">
							<Text>Everyone</Text>
						</TabsTrigger>
						<TabsTrigger value="friends" className="flex-1">
							<Text>Friends</Text>
						</TabsTrigger>
					</TabsList>
				</View>
			</Tabs>
			<ReviewsList
				pages={data?.pages}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
			/>
		</View>
	);
};

export default Reviews;
