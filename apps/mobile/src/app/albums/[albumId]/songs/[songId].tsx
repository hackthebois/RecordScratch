import NotFoundScreen from "#/app/+not-found";
import { InfiniteCommunityReviews } from "#/components/Infinite/InfiniteCommunityReviews";
import Metadata from "#/components/Metadata";
import { RatingInfo } from "#/components/Rating/RatingInfo";
import { getQueryOptions } from "#/utils/deezer";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Dimensions, View } from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";

const SongPage = () => {
	const { albumId, songId } = useLocalSearchParams<{ albumId: string; songId: string }>();

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId! },
		})
	);

	const { data: song } = useSuspenseQuery(
		getQueryOptions({
			route: "/track/{id}",
			input: { id: songId! },
		})
	);

	if (!album || !song) return <NotFoundScreen />;

	const resource: Resource = {
		parentId: String(albumId),
		resourceId: String(songId),
		category: "SONG",
	};

	const Header = () => (
		<Metadata
			title={song.title}
			cover={album.cover_big}
			tags={[
				album.release_date,
				song.explicit_lyrics ? "Explicit" : undefined,
				formatDuration(song.duration),
			]}
		>
			<RatingInfo resource={resource} />
		</Metadata>
	);

	return (
		<View>
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<Tabs.Container
				renderHeader={Header}
				containerStyle={{ flex: 1 }}
				renderTabBar={(props) => (
					<MaterialTabBar
						{...props}
						labelStyle={{ textAlign: "center" }}
						contentContainerStyle={{
							justifyContent: "space-around",
							padding: 16,
						}}
						indicatorStyle={{
							backgroundColor: "transparent",
						}}
					/>
				)}
			>
				<Tabs.Tab name="Album">
					<InfiniteCommunityReviews name={song.title} pageLimit={2} resource={resource} />
				</Tabs.Tab>
			</Tabs.Container>
		</View>
	);
};

export default SongPage;
