import { getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View, Text } from "react-native";
import Metadata from "@/components/Metadata";
import { formatDuration } from "@recordscratch/lib";

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

	return (
		<View className="flex-col mt-5 items-center">
			<Metadata
				title={album.title}
				cover={album.cover_big}
				type="ALBUM OF THE DAY"
				tags={[
					album.release_date,
					album.duration ? `${formatDuration(album.duration)}` : undefined,
					...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
				]}
			>
				<></>
			</Metadata>
		</View>
	);
};

export default AlbumPage;
