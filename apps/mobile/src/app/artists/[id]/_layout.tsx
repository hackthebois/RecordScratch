import Metadata from "@/components/Metadata";
import { getQueryOptions } from "@/utils/deezer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { TouchableOpacity, View } from "react-native-ui-lib";
import { Album, Artist, Track } from "@recordscratch/lib";
import { useLayoutEffect } from "react";
import { ArrowLeft } from "lucide-react-native";
import SongTable from "@/components/SongTable";
import { Text } from "@/components/Text";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { ArtistItem } from "@/components/ArtistItem";
import { ResourceItem } from "@/components/ResourceItem";

const ArtistMetadata = ({ artist }: { artist: Artist }) => {
	return (
		<View className="flex flex-row mt-4 justify-center">
			<Metadata title={artist.name} cover={artist.picture_big ?? ""}>
				<View className="flex flex-row items-center justify-center gap-3">
					{/* <RatingInfo
					resource={{
						resourceId: String(artist.id),
						category: "ARTIST",
					}}
				/>

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
		<View>
			<Text variant="h2" className="dark:text-white px-4 mt-4">
				Top Songs
			</Text>
			<SongTable songs={data} />
			<Text variant="h2" className="dark:text-white px-4 mt-4 mb-2">
				Related Artists
			</Text>
			<FlatList
				data={artists}
				renderItem={({ item: artist }) => (
					<ArtistItem
						artistId={String(artist.id)}
						initialArtist={artist}
						direction="vertical"
						textCss="text-xs line-clamp-2 -mt-2 text-center"
						imageCss="h-24 w-24"
					/>
				)}
				horizontal
				contentContainerClassName="gap-4 px-4 pb-4"
			/>
		</View>
	);
};

const Discography = ({ data }: { data: Album[] }) => {
	const style = StyleSheet.create({
		row: {
			flex: 1,
			justifyContent: "space-around",
		},
	});

	return (
		<View className="flex">
			<Text
				variant="h2"
				className="dark:text-white px-4 mt-4 flex text-center items-center justify-center"
			>
				Album Discography
			</Text>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<ResourceItem
						direction="vertical"
						resource={{
							resourceId: String(item.id),
							category: "ALBUM",
							parentId: String(item.artist?.id),
						}}
					/>
				)}
				numColumns={2}
				columnWrapperStyle={style.row}
				horizontal={false}
				contentContainerClassName="gap-4 px-4 pb-4 mt-3"
			/>
		</View>
	);
};

const ArtistPage = () => {
	const { id } = useLocalSearchParams();

	// Check if id is undefined or not a string
	if (typeof id === "undefined") {
		return <div>Error: ID parameter is missing. Please provide a valid album ID.</div>;
	}

	const artistId = Array.isArray(id) ? id[0] : id;

	// Check if albumId is a string
	if (typeof artistId !== "string") {
		return <div>Error: Invalid ID format. Please provide a valid album ID.</div>;
	}
	const navigation = useNavigation();
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
				limit: 1000,
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

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => <Text className="flex justify-center ml-20">{artist.name}</Text>,
		});
	}, [navigation]);

	return (
		<ScrollView className="flex flex-1">
			<ArtistMetadata artist={artist} />
			<Tab.Navigator
				screenOptions={{
					tabBarContentContainerStyle: {
						justifyContent: "space-around",
						flexGrow: 1,
					},
					tabBarLabelStyle: {
						textAlign: "center",
					},
				}}
			>
				<Tab.Screen
					name="Top Songs"
					children={() => <TopResults data={top.data} artists={artists.data} />}
				/>
				<Tab.Screen
					name="Discography"
					children={() => <Discography data={albums.data} />}
				/>
			</Tab.Navigator>
		</ScrollView>
	);
};

export default ArtistPage;
