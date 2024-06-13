import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Resource } from "@recordscratch/types";
import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Metadata from "@/components/Metadata";
import { Album, Track, TrackAndArtist, formatDuration } from "@recordscratch/lib";
import NotFound from "@/app/+not-found";
import SongTable from "@/components/SongTable";
import { InfiniteCommunityReviews } from "@/components/InfiniteCommunityReviews";

const AlbumTab = ({ album, songs }: { album: Album; songs: TrackAndArtist[] }) => {
	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<ScrollView
				contentContainerClassName="flex flex-col gap-6 flex-1 mt-10"
				nestedScrollEnabled
			>
				<Metadata
					title={album.title}
					cover={album.cover_big}
					type=""
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
		</SafeAreaView>
	);
};

export default function AlbumLayout() {
	const Tab = createMaterialTopTabNavigator();

	const { id } = useLocalSearchParams();

	// Check if id is undefined or not a string
	if (typeof id === "undefined") {
		return <div>Error: ID parameter is missing. Please provide a valid album ID.</div>;
	}

	const albumId = Array.isArray(id) ? id[0] : id;

	// Check if albumId is a string
	if (typeof albumId !== "string") {
		return <div>Error: Invalid ID format. Please provide a valid album ID.</div>;
	}

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

	if (!album) return <NotFound />;

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
	);
}
