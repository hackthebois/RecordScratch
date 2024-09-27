import NotFoundScreen from "#/app/+not-found";
import { formatDuration } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Metadata from "~/components/Metadata";
import RatingDialog from "~/components/Rating/RatingDialog";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import SongTable from "~/components/SongTable";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";
import { getQueryOptions } from "~/lib/deezer";
import { MessageSquareText } from "~/lib/icons/MessageSquareText";

export default function AlbumLayout() {
	const { albumId } = useLocalSearchParams<{ albumId: string }>();
	const id = albumId!;

	const profile = useAuth((s) => s.profile);

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
				<Stack.Screen
					options={{
						title: album.title,
						headerBackVisible: true,
					}}
				/>
				<SongTable
					ListHeaderComponent={
						<Metadata
							title={album.title}
							type="ALBUM"
							cover={album.cover_big}
							tags={[
								album.release_date,
								album.duration ? `${formatDuration(album.duration)}` : undefined,
								...(album.genres?.data.map((genre: { name: any }) => genre.name) ??
									[]),
							]}
						>
							<Pressable
								onPress={() => {
									router.push(`/artists/${album.artist?.id}`);
								}}
								style={{ maxWidth: "100%" }}
							>
								<Text className="text-muted-foreground">{album.artist?.name}</Text>
							</Pressable>
							<View className="flex-row gap-4 my-4">
								<RatingInfo resource={resource} size="lg" />
								<RatingDialog
									resource={resource}
									name={album.title}
									userId={profile!.userId}
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
					}
					songs={songs.data!.map((song) => ({ ...song, album }))}
				/>
			</View>
		</SafeAreaView>
	);
}
