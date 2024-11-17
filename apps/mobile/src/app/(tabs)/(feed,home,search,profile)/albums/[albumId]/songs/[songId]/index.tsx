import NotFoundScreen from "#/app/+not-found";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatBlock from "~/components/CoreComponents/StatBlock";
import Metadata from "~/components/Metadata";
import RateButton from "~/components/Rating/RateButton";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

const SongPage = () => {
	const { albumId, songId } = useLocalSearchParams<{ albumId: string; songId: string }>();

	const [total] = api.ratings.count.useSuspenseQuery({
		resourceId: songId,
		category: "SONG",
	});

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
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
			<View className="flex flex-1">
				<Stack.Screen
					options={{
						headerRight: () => (
							<Link href={`/albums/${album.id}`} asChild>
								<Button variant="secondary" size={"sm"}>
									<Text>Go to album</Text>
								</Button>
							</Link>
						),
					}}
				/>
				<ScrollView>
					<Metadata
						title={song.title}
						cover={album.cover_big}
						type="SONG"
						tags={[
							album.release_date,
							song.explicit_lyrics ? "Explicit" : undefined,
							formatDuration(song.duration),
						]}
					>
						<View className="flex-row gap-4 my-4">
							<RatingInfo resource={resource} />
							<RateButton
								imageUrl={album.cover_big}
								resource={resource}
								name={song.title}
							/>
						</View>
						<View className="flex-row w-full px-4 pb-4">
							<Link href={`/albums/${album.id}/songs/${song.id}/reviews`} asChild>
								<Pressable className="flex-1">
									<StatBlock title="Ratings" description={String(total)} />
								</Pressable>
							</Link>
						</View>
					</Metadata>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default SongPage;
