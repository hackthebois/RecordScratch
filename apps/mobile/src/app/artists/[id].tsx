import Metadata from "#/components/Metadata";
import { getQueryOptions } from "#/utils/deezer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { TouchableOpacity, View } from "react-native-ui-lib";
import { Album, Artist, Track } from "@recordscratch/lib";
import { useEffect, useLayoutEffect, useState } from "react";
import SongTable from "#/components/SongTable";
import { Text } from "#/components/CoreComponents/Text";
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { ArtistItem } from "#/components/Item/ArtistItem";
import { ResourceItem } from "#/components/Item/ResourceItem";
import { RatingInfo } from "#/components/Rating/RatingInfo";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import ColumnItem from "#/components/CoreComponents/ColumnItem";

const ArtistMetadata = ({ artist }: { artist: Artist }) => {
	return (
		<View className="flex flex-row mt-4 justify-center">
			<Metadata title={artist.name} cover={artist.picture_big ?? ""}>
				<View className="flex flex-row items-center justify-center gap-3">
					<RatingInfo
						resource={{
							resourceId: String(artist.id),
							category: "ARTIST",
						}}
					/>
					{/*
				<AddToList
					resourceId={String(artist.id)}
					category="ARTIST"
				/> */}
				</View>
			</Metadata>
		</View>
	);
};

const TopResults = ({ data, artists }: { data: Track[]; artists: Artist[] }) => {
	return (
		<Tabs.ScrollView>
			<Text variant="h1" className="px-4 my-8">
				Top Songs
			</Text>
			<View>
				<SongTable songs={data} />
			</View>

			<Text variant="h1" className="px-4 my-8">
				Related Artists
			</Text>
			<FlatList
				data={artists}
				renderItem={({ item: artist }) => (
					<ArtistItem
						artistId={String(artist.id)}
						initialArtist={artist}
						direction="vertical"
						textCss="line-clamp-2 text-center w-32 -mt-2"
						imageWidthAndHeight={105}
					/>
				)}
				horizontal
				contentContainerClassName="gap-2 pb-4"
			/>
		</Tabs.ScrollView>
	);
};

const Discography = ({ data }: { data: Album[] }) => {
	return (
		<Tabs.FlatList
			data={data}
			renderItem={({ item }) => (
				<ResourceItem
					direction="vertical"
					resource={{
						resourceId: String(item.id),
						category: "ALBUM",
						parentId: String(item.artist?.id),
					}}
					titleCss="w-40 truncate line-clamp-2"
				/>
			)}
			numColumns={2}
			columnWrapperStyle={{
				flex: 1,
				justifyContent: "space-around",
			}}
			contentContainerClassName=" gap-4 px-4 pb-4 mt-3"
		/>
	);
};

const ArtistPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const artistId = id!;

	const Tab = createMaterialTopTabNavigator();

	const { data: artist } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}",
			input: {
				id: artistId,
			},
		})
	);
	const { data: top } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/top",
			input: {
				id: artistId,
			},
		})
	);
	const { data: albums } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/albums",
			input: {
				id: artistId,
				limit: 100,
			},
		})
	);
	const { data: artists } = useSuspenseQuery(
		getQueryOptions({
			route: "/artist/{id}/related",
			input: {
				id: artistId,
			},
		})
	);

	const [tabIndex, setTabIndex] = useState(0);

	return (
		<>
			<Stack.Screen options={{ headerTitle: `${artist.name}` }} />

			<Tabs.Container
				renderHeader={() => <ArtistMetadata artist={artist} />}
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
				<Tabs.Tab name="Artist">
					<TopResults data={top.data} artists={artists.data} />
				</Tabs.Tab>
				<Tabs.Tab name="Discography">
					<Discography data={albums.data} />
				</Tabs.Tab>
			</Tabs.Container>
		</>
	);
};

export default ArtistPage;
