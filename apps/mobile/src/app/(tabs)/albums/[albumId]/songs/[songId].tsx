import NotFoundScreen from "#/app/+not-found";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Metadata from "~/components/Metadata";
import RatingDialog from "~/components/Rating/RatingDialog";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { getQueryOptions } from "~/lib/deezer";
import { MessageSquareText } from "~/lib/icons/MessageSquareText";

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

	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.community.useInfiniteQuery(
		{
			limit: 5,
			resource,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

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
						<View className="flex-row w-full px-4 pb-4">
							<Link href={`/albums/${album.id}/songs/${song.id}/reviews`} asChild>
								<Pressable className="rounded-xl p-4 flex-1 bg-secondary">
									<MessageSquareText className="text-secondary-foreground" />
									<Text className="text-lg font-semibold text-secondary-foreground">
										Reviews
									</Text>
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
