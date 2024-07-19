import React, { useLayoutEffect, useState } from "react";
import { ScrollView, TextInput, View, StyleSheet } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDebounce } from "@recordscratch/lib";
import MusicSearch from "#/components/Search/MusicSearch";
import ProfileSearch from "#/components/Search/ProfileSearch";
import { TouchableOpacity } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";

const SearchInput = ({ query, setQuery }: { query: string; setQuery: (_: string) => void }) => {
	const navigation = useNavigation();
	return (
		<View className="flex-row items-center ml-4 mt-10">
			<TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
				<AntDesign name="arrowleft" size={24} color="black" />
			</TouchableOpacity>
			<View className="flex-row items-center border border-gray-300 rounded-md w-5/6 pt-2">
				<AntDesign name="search1" size={20} color="grey" className="ml-2" />
				<TextInput
					id="name"
					autoComplete="off"
					placeholder="Search"
					value={query}
					className="flex-1 bg-transparent p-2 text-lg outline-none"
					onChangeText={(text) => setQuery(text)}
				/>
			</View>
		</View>
	);
};

const Results = ({ children }: { children: React.ReactNode }) => {
	return <ScrollView className="mt-3">{children}</ScrollView>;
};

export default function SearchLayout() {
	const Tab = createMaterialTopTabNavigator();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);

	return (
		<ScrollView className="flex flex-1">
			<Stack.Screen
				options={{
					header: () => (
						<View className="mt-8">
							<SearchInput query={query} setQuery={setQuery} />
						</View>
					),
				}}
			/>
			<Tab.Navigator screenOptions={searchBarOptions}>
				<Tab.Screen
					name="Top Results"
					children={() => (
						<Results>
							<MusicSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
						</Results>
					)}
				/>
				<Tab.Screen
					name="Profiles"
					children={() => (
						<Results>
							<ProfileSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
						</Results>
					)}
				/>
				<Tab.Screen
					name="Albums"
					children={() => (
						<Results>
							<MusicSearch
								query={debouncedQuery}
								onNavigate={() => setQuery("")}
								hide={{ songs: true, artists: true }}
							/>
						</Results>
					)}
				/>
				<Tab.Screen
					name="Artists"
					children={() => (
						<Results>
							<MusicSearch
								query={debouncedQuery}
								onNavigate={() => setQuery("")}
								hide={{ songs: true, albums: true }}
							/>
						</Results>
					)}
				/>
				<Tab.Screen
					name="Songs"
					children={() => (
						<Results>
							<MusicSearch
								query={debouncedQuery}
								onNavigate={() => setQuery("")}
								hide={{ artists: true, albums: true }}
							/>
						</Results>
					)}
				/>
			</Tab.Navigator>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
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
});

const searchBarOptions = {
	tabBarStyle: styles.tabBarStyle,
	tabBarItemStyle: styles.tabBarItemStyle,
	tabBarLabelStyle: styles.tabBarLabelStyle,
	tabBarScrollEnabled: true,
};
