import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Resource } from "@recordscratch/types";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import Metadata from "@/components/Metadata";
import { Album, Track, TrackAndArtist, formatDuration } from "@recordscratch/lib";
import SongTable from "@/components/SongTable";
import { InfiniteCommunityReviews } from "@/components/InfiniteCommunityReviews";
import NotFoundScreen from "@/app/+not-found";
import { RatingInfo } from "@/components/RatingInfo";
import RatingDialog from "@/components/RatingDialog";
import { api } from "@/utils/api";

const AlbumTab = ({ album, songs }: { album: Album; songs: TrackAndArtist[] }) => {
	return (
		<View className="flex flex-col gap-6 mt-6 mb-2">
			<SongTable songs={songs.map((song) => ({ ...song, album })) ?? []} />
		</View>
	);
};

export default function AlbumLayout() {
	const Tab = createMaterialTopTabNavigator();
	const { albumId } = useLocalSearchParams<{ albumId: string }>();
	const id = albumId!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id },
		})
	);

	if (!album) return <NotFoundScreen />;

	const [profile] = api.profiles.me.useSuspenseQuery();

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
		<ScrollView className="flex flex-1" nestedScrollEnabled>
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<Metadata
				title={album.title}
				cover={album.cover_big}
				tags={[
					album.release_date,
					album.duration ? `${formatDuration(album.duration)}` : undefined,
					...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
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
				<View className="flex flex-row items-center gap-10">
					<RatingInfo resource={resource} size="lg" />
					<RatingDialog resource={resource} name={album.title} userId={profile!.userId} />
				</View>
			</Metadata>
			<Tab.Navigator
				screenOptions={{
					tabBarContentContainerStyle: {
						justifyContent: "space-around",
					},
					tabBarLabelStyle: {
						textAlign: "center",
					},
				}}
			>
				<Tab.Screen
					name="Album"
					children={() => <AlbumTab album={album} songs={songs.data} />}
				/>
				<Tab.Screen
					name="Reviews"
					children={() => (
						<InfiniteCommunityReviews
							resource={resource}
							pageLimit={10}
							name={album.title}
						/>
					)}
				/>
			</Tab.Navigator>
		</ScrollView>
	);
}
