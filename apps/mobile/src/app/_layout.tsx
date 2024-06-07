import { TRPCProvider } from "@/utils/api";
import { NAV_THEME } from "@/utils/contants";
import { useColorScheme } from "@/utils/useColorScheme";
import {
	Montserrat_100Thin,
	Montserrat_200ExtraLight,
	Montserrat_300Light,
	Montserrat_400Regular,
	Montserrat_500Medium,
	Montserrat_600SemiBold,
	Montserrat_700Bold,
	Montserrat_800ExtraBold,
	Montserrat_900Black,
	useFonts,
} from "@expo-google-fonts/montserrat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { Slot, Stack, Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../styles.css";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDebounce } from "@recordscratch/lib";
import { View } from "react-native-ui-lib";
import MusicSearch from "@/components/MusicSearch";
import ProfileSearch from "@/components/ProfileSearch";
import { Search } from "lucide-react-native";
import { TextInput, StyleSheet } from "react-native";

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Tab = createMaterialTopTabNavigator();

const SearchTabs = ({
	debouncedQuery,
	setQuery,
}: {
	debouncedQuery: string;
	setQuery: (_: string) => void;
}) => {
	return (
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
			<Tab.Screen
				name="Top Results"
				children={() => (
					<View style={styles.resultsContainer}>
						<MusicSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
					</View>
				)}
			/>
			<Tab.Screen
				name="Profiles"
				children={() => (
					<View style={styles.resultsContainer}>
						<ProfileSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
					</View>
				)}
			/>
			<Tab.Screen
				name="Albums"
				children={() => <View style={styles.resultsContainer}></View>}
			/>
			<Tab.Screen
				name="Artists"
				children={() => <View style={styles.resultsContainer}></View>}
			/>
			<Tab.Screen
				name="Songs"
				children={() => <View style={styles.resultsContainer}></View>}
			/>
		</Tab.Navigator>
	);
};

export default function RootLayout() {
	const [fontLoaded, fontError] = useFonts({
		Montserrat_100Thin,
		Montserrat_200ExtraLight,
		Montserrat_300Light,
		Montserrat_400Regular,
		Montserrat_500Medium,
		Montserrat_600SemiBold,
		Montserrat_700Bold,
		Montserrat_800ExtraBold,
		Montserrat_900Black,
	});
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);

				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		})();
	}, []);

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (fontError) throw fontError;
	}, [fontError]);

	useEffect(() => {
		if (fontLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontLoaded, isColorSchemeLoaded]);

	if (!fontLoaded || !isColorSchemeLoaded) {
		return null;
	}

	return (
		<TRPCProvider>
			<SafeAreaProvider>
				<ThemeProvider value={LIGHT_THEME}>
					{/* <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}> */}
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{
								headerShown: false,
							}}
						/>
					</Stack>
				</ThemeProvider>
			</SafeAreaProvider>
		</TRPCProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		marginTop: 2,
		paddingHorizontal: 10,
		marginBottom: 3,
	},
	chevron: {
		marginLeft: 4,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 1,
		width: "80%",
		marginBottom: 1,
	},
	searchIcon: {
		marginLeft: 4,
		color: "gray",
	},
	input: {
		flex: 1,
		borderWidth: 0,
		backgroundColor: "transparent",
		paddingVertical: 2,
		paddingLeft: 4,
		fontSize: 16,
	},
	resultsContainer: {
		marginTop: 3,
	},
});
