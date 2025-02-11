import DistributionChart from "@/components/DistributionChart";
import { ReviewsList } from "@/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { getQueryOptions } from "@/lib/deezer";
import { Resource } from "@recordscratch/types";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, View } from "react-native";

const tabs = ["everyone", "friends"];
const ratingTabs = ["REVIEW", "RATING"];

const Reviews = () => {
	const router = useRouter();
	const params = useLocalSearchParams<{
		albumId: string;
		tab?: string;
		ratingTab?: string;
		ratingFilter?: string;
	}>();
	const { albumId } = params;
	const tab =
		params.tab && tabs.includes(params.tab) ? params.tab : "everyone";
	const ratingTab = (
		params.ratingTab && ratingTabs.includes(params.ratingTab)
			? params.ratingTab
			: "all"
	) as "REVIEW" | "RATING" | "all";
	const ratingFilter =
		params.ratingFilter && params.ratingFilter !== "undefined"
			? Number(params.ratingFilter)
			: undefined;

	const id = albumId!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id },
		}),
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
		},
	);

	useEffect(() => {
		if (values && ratingFilter && values[ratingFilter - 1] === 0) {
			router.setParams({
				ratingFilter: undefined,
			});
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
			{Platform.OS === "web" && (
				<Text variant="h3" className="mb-4 text-center">
					{album.title + " Ratings"}
				</Text>
			)}
			<Tabs
				value={tab}
				onValueChange={(tab) =>
					router.setParams({
						tab: tab === "everyone" ? undefined : tab,
					})
				}
			>
				<View className="flex items-center px-4">
					<TabsList className="w-full flex-row sm:w-2/3">
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
						<View className="p-4">
							<DistributionChart
								distribution={values}
								value={ratingFilter}
								onChange={(value) => {
									router.setParams({
										ratingFilter: value,
									});
								}}
								height={Platform.OS === "web" ? 225 : 80}
							/>
						</View>
						<Tabs
							value={ratingTab}
							onValueChange={(value) =>
								value !== tab
									? router.setParams({ ratingTab: value })
									: router.setParams({ ratingTab: undefined })
							}
						>
							<View className="flex items-center px-4">
								<TabsList className="w-full flex-row sm:w-2/3">
									<TabsTrigger
										value="REVIEW"
										className="flex-1"
									>
										<Text>Reviews</Text>
									</TabsTrigger>
									<TabsTrigger
										value="RATING"
										className="flex-1"
									>
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
