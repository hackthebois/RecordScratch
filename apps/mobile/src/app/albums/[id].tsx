import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Resource } from "@recordscratch/types";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Metadata from "@/components/Metadata";
import { Album, Track, TrackAndArtist, formatDuration } from "@recordscratch/lib";
import SongTable from "@/components/SongTable";
import { InfiniteCommunityReviews } from "@/components/InfiniteCommunityReviews";
import NotFoundScreen from "@/app/+not-found";

const AlbumTab = ({ album, songs }: { album: Album; songs: TrackAndArtist[] }) => {
	return (
		<ScrollView className="flex flex-col gap-6 mt-6 mb-2" nestedScrollEnabled>
			<Metadata
				title={album.title}
				cover={album.cover_big}
				tags={[
					album.release_date,
					album.duration ? `${formatDuration(album.duration)}` : undefined,
					...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
				]}
			>
				<></>
			</Metadata>
			<SongTable songs={songs.map((song) => ({ ...song, album })) ?? []} />
		</ScrollView>
	);
};

export default function AlbumLayout() {
	const Tab = createMaterialTopTabNavigator();
	const { id } = useLocalSearchParams<{ id: string }>();
	const albumId = id!;

	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId! },
		})
	);

	const navigation = useNavigation();
	useLayoutEffect(() => {
		navigation.setOptions({
			title: `${album.title}`,
		});
	}, [navigation]);

	if (!album) return <NotFoundScreen />;

	const { data: songs } = useSuspenseQuery({
		...getQueryOptions({
			route: "/album/{id}/tracks",
			input: { id: albumId, limit: 1000 },
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
		<SafeAreaView className="flex flex-1">
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
		</SafeAreaView>
	);
}
