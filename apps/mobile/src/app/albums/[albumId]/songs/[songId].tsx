import NotFoundScreen from "#/app/+not-found";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InfiniteCommunityReviews } from "~/components/Infinite/InfiniteCommunityReviews";
import Metadata from "~/components/Metadata";
import RatingDialog from "~/components/Rating/RatingDialog";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";

const SongPage = () => {
	const [value, setValue] = useState("reviews");
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

	const [profile] = api.profiles.me.useSuspenseQuery();

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
						title: song.title,
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
							<RatingDialog
								resource={resource}
								name={song.title}
								userId={profile!.userId}
							/>
						</View>
					</Metadata>
					<Tabs value={value} onValueChange={setValue}>
						<View className="px-4">
							<TabsList className="flex-row w-full">
								<TabsTrigger value="reviews" className="flex-1">
									<Text>Reviews</Text>
								</TabsTrigger>
							</TabsList>
						</View>
						<TabsContent value="reviews">
							<InfiniteCommunityReviews
								name={song.title}
								pageLimit={2}
								resource={resource}
							/>
						</TabsContent>
					</Tabs>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default SongPage;
