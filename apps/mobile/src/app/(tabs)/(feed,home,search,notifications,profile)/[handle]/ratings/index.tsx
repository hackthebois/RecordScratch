import NotFoundScreen from "@/app/+not-found";
import DistributionChart from "@/components/DistributionChart";
import { ReviewsList } from "@/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { keepPreviousData } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

type RatingCategory = "all" | "ALBUM" | "SONG";

const Reviews = () => {
	const { handle, rating } = useLocalSearchParams<{ handle: string; rating?: string }>();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const [tab, setTab] = useState<RatingCategory>("all");
	const [ratingFilter, setRatingFilter] = useState<number | undefined>(
		rating ? Number(rating) : undefined
	);

	const { data: values } = api.profiles.distribution.useQuery(
		{ userId: profile!.userId, category: tab !== "all" ? tab : undefined },
		{
			enabled: !!profile,
			placeholderData: keepPreviousData,
		}
	);

	useEffect(() => {
		if (values && ratingFilter && values[ratingFilter - 1] === 0) {
			setRatingFilter(undefined);
		}
	}, [values]);

	if (!profile) return <NotFoundScreen />;

	return (
		<>
			<Stack.Screen options={{ title: handle + " Ratings", headerBackVisible: true }} />
			<ReviewsList
				limit={20}
				filters={{
					profileId: profile.userId,
					category: tab !== "all" ? tab : undefined,
					rating: ratingFilter,
				}}
				ListHeaderComponent={
					<>
						<DistributionChart
							distribution={values}
							value={ratingFilter}
							onChange={setRatingFilter}
						/>
						<Tabs value={tab} onValueChange={(v) => setTab(v as RatingCategory)}>
							<View className="px-4">
								<TabsList className="flex-row w-full">
									<TabsTrigger value="all" className="flex-1">
										<Text>All</Text>
									</TabsTrigger>
									<TabsTrigger value="ALBUM" className="flex-1">
										<Text>Albums</Text>
									</TabsTrigger>
									<TabsTrigger value="SONG" className="flex-1">
										<Text>Songs</Text>
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
