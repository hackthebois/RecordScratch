import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDebounce } from "@recordscratch/lib";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import MusicSearch from "~/components/Search/MusicSearch";
import ProfileSearch from "~/components/Search/ProfileSearch";
import { Search } from "~/lib/icons/Search";

const SearchInput = ({ query, setQuery }: { query: string; setQuery: (_: string) => void }) => {
	return (
		<View className="flex-row items-center border border-gray-300 rounded-md flex-1 h-12">
			<Search size={20} className="mx-2 text-foreground" />
			<TextInput
				id="name"
				autoComplete="off"
				placeholder="Search"
				value={query}
				className="flex-1 h-full text-lg outline-none"
				onChangeText={(text) => setQuery(text)}
			/>
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
					headerTitle: () => <SearchInput query={query} setQuery={setQuery} />,
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
