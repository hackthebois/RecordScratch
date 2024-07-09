import NotFoundScreen from "@/app/+not-found";
import { InfiniteCommunityReviews } from "@/components/InfiniteCommunityReviews";
import Metadata from "@/components/Metadata";
import { RatingInfo } from "@/components/RatingInfo";
import { getQueryOptions } from "@/utils/deezer";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

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

	return (
		<ScrollView className="flex flex-1">
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
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
			<InfiniteCommunityReviews name={song.title} pageLimit={2} resource={resource} />
		</ScrollView>
	);
};

export default SongPage;
