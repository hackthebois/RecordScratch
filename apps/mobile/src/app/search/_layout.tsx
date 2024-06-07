import React, { useLayoutEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useNavigation } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDebounce } from "@recordscratch/lib";
import MusicSearch from "@/components/MusicSearch";
import ProfileSearch from "@/components/ProfileSearch";
import { TouchableOpacity } from "react-native-ui-lib";
import AlbumSearch from "@/components/AlbumSearch";

const SearchInput = ({ query, setQuery }: { query: string; setQuery: (_: string) => void }) => {
	const navigation = useNavigation();
	return (
		<View className="flex-row items-center mt-2 px-4">
			<TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
				<ArrowLeft />
			</TouchableOpacity>
			<View className="flex-row items-center border border-gray-300 rounded-md w-5/6">
				<Search size={20} className="ml-2 text-gray-500" />
				<TextInput
					id="name"
					autoComplete="off"
					placeholder="Search"
					value={query}
					className="flex-1 bg-transparent p-2 pl-2 text-lg outline-none"
					onChangeText={(text) => setQuery(text)}
				/>
			</View>
		</View>
	);
};

const TopResults = ({
	debouncedQuery,
	setQuery,
}: {
	debouncedQuery: string;
	setQuery: (_: string) => void;
}) => (
	<ScrollView className="mt-3">
		<MusicSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
	</ScrollView>
);
const ProfileResults = ({
	debouncedQuery,
	setQuery,
}: {
	debouncedQuery: string;
	setQuery: (_: string) => void;
}) => (
	<ScrollView className="mt-3">
		<ProfileSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
	</ScrollView>
);
const AlbumResults = ({
	debouncedQuery,
	setQuery,
}: {
	debouncedQuery: string;
	setQuery: (_: string) => void;
}) => (
	<ScrollView className="mt-3">
		<AlbumSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
	</ScrollView>
);

const ArtistResults = ({
	debouncedQuery,
	setQuery,
}: {
	debouncedQuery: string;
	setQuery: (_: string) => void;
}) => (
	<ScrollView className="mt-3">
		<MusicSearch
			query={debouncedQuery}
			onNavigate={() => setQuery("")}
			hide={{ songs: true, albums: true }}
		/>
	</ScrollView>
);
const SongResults = ({
	debouncedQuery,
	setQuery,
}: {
	debouncedQuery: string;
	setQuery: (_: string) => void;
}) => (
	<ScrollView className="mt-3">
		<MusicSearch
			query={debouncedQuery}
			onNavigate={() => setQuery("")}
			hide={{ artists: true, albums: true }}
		/>
	</ScrollView>
);

export default function SearchLayout() {
	const Tab = createMaterialTopTabNavigator();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => <SearchInput query={query} setQuery={setQuery} />,
		});
	}, [navigation, query]);

	const params = { debouncedQuery, setQuery };

	return (
		<View className="flex flex-1">
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: {
						justifyContent: "center",
					},
					tabBarItemStyle: {
						width: "auto",
						alignItems: "center",
						flex: 1,
					},
					tabBarLabelStyle: {
						textAlign: "center",
					},
					tabBarScrollEnabled: true,
				}}
			>
				<Tab.Screen name="Top Results" children={() => <TopResults {...params} />} />
				<Tab.Screen name="Profiles" children={() => <ProfileResults {...params} />} />
				<Tab.Screen name="Albums" children={() => <AlbumResults {...params} />} />
				<Tab.Screen name="Artists" children={() => <ArtistResults {...params} />} />
				<Tab.Screen name="Songs" children={() => <SongResults {...params} />} />
			</Tab.Navigator>
		</View>
	);
}
