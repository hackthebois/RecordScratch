import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Metadata from "@/components/Metadata";
import { formatDuration } from "@recordscratch/lib";
import NotFound from "@/app/+not-found";
import SongTable from "@/components/SongTable";

const AlbumPage = () => {
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
				<SongTable songs={songs?.data?.map((song) => ({ ...song, album })) ?? []} />
			</ScrollView>
		</SafeAreaView>
	);
};

export default AlbumPage;
