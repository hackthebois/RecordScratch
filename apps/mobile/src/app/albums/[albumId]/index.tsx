import { Resource } from "@recordscratch/types";
import { getQueryOptions } from "~/lib/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import Metadata from "~/components/Metadata";
import { Album, TrackAndArtist, formatDuration } from "@recordscratch/lib";
import SongTable from "~/components/SongTable";
import { InfiniteCommunityReviews } from "~/components/Infinite/InfiniteCommunityReviews";
import NotFoundScreen from "#/app/+not-found";
import { RatingInfo } from "~/components/Rating/RatingInfo";
import { api } from "~/lib/api";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import RatingDialog from "~/components/Rating/RatingDialog";

const AlbumTab = ({ album, songs }: { album: Album; songs: TrackAndArtist[] }) => {
	return <SongTable songs={songs.map((song) => ({ ...song, album })) ?? []} />;
};

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

	const Header = () => (
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
	);

	return (
		<View className="flex flex-1">
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<Tabs.Container
				renderHeader={Header}
				renderTabBar={(props) => (
					<MaterialTabBar
						{...props}
						contentContainerStyle={{
							flexDirection: "row",
							justifyContent: "space-around",
							padding: 16,
						}}
						labelStyle={{ fontSize: 16 }}
						indicatorStyle={{
							left: (Dimensions.get("window").width / 2 - 225) / 2,
							backgroundColor: "orange",
						}}
					/>
				)}
			>
				<Tabs.Tab name="Album">
					<Tabs.ScrollView>
						<AlbumTab album={album} songs={songs.data} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Reviews">
					<InfiniteCommunityReviews
						resource={resource}
						pageLimit={2}
						name={album.title}
					/>
				</Tabs.Tab>
			</Tabs.Container>
		</View>
	);
}
{
	/* <Tab.Navigator
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
			</Tab.Navigator> */
}
