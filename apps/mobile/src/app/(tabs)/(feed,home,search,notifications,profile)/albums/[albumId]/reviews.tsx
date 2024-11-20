import { Resource } from "@recordscratch/types";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import DistributionChart from "~/components/DistributionChart";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

type RatingType = "all" | "REVIEW" | "RATING";

const Reviews = () => {
	const { albumId } = useLocalSearchParams<{ albumId: string }>();
	const [tab, setTab] = useState("everyone");
	const [ratingTab, setRatingTab] = useState<RatingType>("all");
	const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

	const id = albumId!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id },
		})
	);

	const { data: values } = api.ratings.distribution.useQuery(
		{
			resourceId: albumId,
			filters: {
				reviewType: ratingTab === "all" ? undefined : ratingTab,
				following: tab === "friends",
			},
		},
		{
			placeholderData: keepPreviousData,
		}
	);

	useEffect(() => {
		if (values && ratingFilter && values[ratingFilter - 1] === 0) {
			setRatingFilter(undefined);
		}
	}, [values]);

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	return (
		<View className="flex-1">
			<Stack.Screen options={{ title: album.title + " Ratings" }} />
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
				filters={{
					following: tab === "friends",
					resourceId: resource.resourceId,
					category: resource.category,
					ratingType: ratingTab === "all" ? undefined : ratingTab,
					rating: ratingFilter,
				}}
				ListHeaderComponent={
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
		</View>
	);
};

export default Reviews;
