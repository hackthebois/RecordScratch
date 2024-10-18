import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import DistributionChart from "~/components/DistributionChart";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

type RatingType = "all" | "REVIEW" | "RATING";

const Reviews = () => {
	const [tab, setTab] = useState("for-you");
	const { albumId, songId } = useLocalSearchParams<{ albumId: string; songId: string }>();
	const [ratingTab, setRatingTab] = useState<RatingType>("all");
	const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

	const { data: song } = useSuspenseQuery(
		getQueryOptions({
			route: "/track/{id}",
			input: { id: songId! },
		})
	);

	const { data: values } = api.ratings.distribution.useQuery({
		resourceId: songId,
		reviewType: ratingTab === "all" ? undefined : ratingTab,
	});

	const resource: Resource = {
		parentId: String(albumId),
		resourceId: String(songId),
		category: "SONG",
	};

	return (
		<>
			<Stack.Screen options={{ title: song.title + " Reviews", headerBackVisible: true }} />
			<Tabs value={tab} onValueChange={setTab}>
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="for-you" className="flex-1">
							<Text>Everyone</Text>
						</TabsTrigger>
						<TabsTrigger value="friends" className="flex-1">
							<Text>Friends</Text>
						</TabsTrigger>
					</TabsList>
				</View>
			</Tabs>
			<ReviewsList
				filters={{
					following: tab === "friends",
					resourceId: resource.resourceId,
					category: resource.category,
					ratingType: ratingTab === "all" ? undefined : ratingTab,
				}}
				limit={20}
				ListHeader={
					<>
						<DistributionChart
							distribution={values}
							value={ratingFilter}
							onChange={setRatingFilter}
						/>
						<Tabs
							value={ratingTab}
							onValueChange={(v) => setRatingTab(v as RatingType)}
						>
							<View className="px-4">
								<TabsList className="flex-row w-full">
									<TabsTrigger value="all" className="flex-1">
										<Text>All</Text>
									</TabsTrigger>
									<TabsTrigger value="REVIEW" className="flex-1">
										<Text>Reviews</Text>
									</TabsTrigger>
									<TabsTrigger value="RATING" className="flex-1">
										<Text>Ratings</Text>
									</TabsTrigger>
								</TabsList>
							</View>
						</Tabs>
					</>
				}
			/>
		</>
	);
};

export default Reviews;
