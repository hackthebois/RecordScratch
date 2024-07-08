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
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../styles.css";
import { AuthProvider, useAuth } from "@/utils/Authentication";

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
	initialRouteName: "auth",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
		<AuthProvider>
			<TRPCProvider>
				<SafeAreaProvider>
					<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
						<Stack
							screenOptions={{
								animation: "slide_from_right",
								headerTitleAlign: "center",
							}}
						>
							<Stack.Screen
								name="(tabs)"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="(auth)/signin"
								options={{
									headerShown: false,
								}}
							/>
						</Stack>
					</ThemeProvider>
				</SafeAreaProvider>
			</TRPCProvider>
		</AuthProvider>
	);
}
