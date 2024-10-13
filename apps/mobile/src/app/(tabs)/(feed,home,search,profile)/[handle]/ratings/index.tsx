import NotFoundScreen from "#/app/+not-found";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import DistributionChart from "~/components/DistributionChart";
import { ReviewsList } from "~/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const Chart = ({
	userId,
	tab,
	filter,
	setTab,
	onChange,
}: {
	userId: string;
	tab: string;
	filter: number | undefined;
	setTab: (_category: string) => void;
	onChange: (_filter: number | undefined) => void;
}) => {
	const [values] = api.profiles.distribution.useSuspenseQuery({ userId });

	return (
		<View>
			<DistributionChart distribution={values} value={filter} onChange={onChange} />
			<Tabs value={tab} onValueChange={setTab}>
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="" className="flex-1">
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
		</View>
	);
};

const Reviews = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const [tab, setTab] = useState("");
	const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

	const onChange = (filter: number | undefined) => {
		if (filter === ratingFilter) setRatingFilter(undefined);
		else setRatingFilter(filter);
		console.log(filter);
	};

	if (!profile) return <NotFoundScreen />;

	return (
		<>
			<Stack.Screen options={{ title: handle + " Ratings", headerBackVisible: true }} />
			<ReviewsList
				limit={20}
				filters={{
					profileId: profile.userId,
					category: tab === "SONG" ? "SONG" : tab === "ALBUM" ? "ALBUM" : undefined,
					rating: ratingFilter,
				}}
				ListHeader={
					<Chart
						userId={profile.userId}
						tab={tab}
						setTab={setTab}
						filter={ratingFilter}
						onChange={onChange}
					/>
				}
			/>
		</>
	);
};

export default Reviews;
