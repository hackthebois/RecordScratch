import NotFoundScreen from "#/app/+not-found";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Metadata from "~/components/Metadata";
import RateButton from "~/components/Rating/RateButton";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import SongTable from "~/components/SongTable";
import { Text } from "~/components/ui/text";
import { getQueryOptions } from "~/lib/deezer";
import { MessageSquareText } from "~/lib/icons/MessageSquareText";

export default function AlbumLayout() {
	const { albumId } = useLocalSearchParams<{ albumId: string }>();
	const id = albumId!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id },
		})
	);

	if (!album) return <NotFoundScreen />;

	const { data: songs } = useSuspenseQuery({
		...getQueryOptions({
			route: "/album/{id}/tracks",
			input: { id, limit: 1000 },
		}),
		initialData: {
			data: album?.tracks?.data ?? [],
		},
	});

	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
			<View className="flex flex-1">
				<ScrollView contentContainerClassName="pb-4">
					<Stack.Screen />
					<Metadata
						title={album.title}
						type="ALBUM"
						cover={album.cover_big}
						tags={[
							album.release_date,
							album.duration ? `${formatDuration(album.duration)}` : undefined,
							...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
						]}
					>
						<Pressable
							onPress={() => {
								router.navigate(`/artists/${album.artist?.id}`);
							}}
							style={{ maxWidth: "100%" }}
						>
							<Text className="text-muted-foreground">{album.artist?.name}</Text>
						</Pressable>
						<View className="flex-row gap-4 my-4">
							<RatingInfo resource={resource} size="lg" />
							<RateButton
								imageUrl={album.cover_big}
								resource={resource}
								name={album.title}
							/>
						</View>
						<View className="flex-row w-full px-4 pb-4">
							<Link href={`/albums/${album.id}/reviews`} asChild>
								<Pressable className="rounded-xl p-4 flex-1 bg-secondary">
									<MessageSquareText className="text-secondary-foreground" />
									<Text className="text-lg font-semibold text-secondary-foreground">
										Reviews
									</Text>
								</Pressable>
							</Link>
						</View>
					</Metadata>
					<SongTable songs={songs.data!.map((song) => ({ ...song, album }))} />
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
