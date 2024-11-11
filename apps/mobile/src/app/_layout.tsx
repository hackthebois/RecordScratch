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
import { Theme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { TRPCProvider } from "~/lib/api";
import { AuthProvider } from "~/lib/auth";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import "../styles.css";

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
			const theme = await SecureStore.getItemAsync("theme");
			if (!theme) {
				await SecureStore.setItemAsync("theme", colorScheme);
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
								animation: "fade",
								headerBackTitleVisible: false,
								headerTitle: (props) => <Text variant="h4">{props.children}</Text>,
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
							<Stack.Screen
								name="(auth)/onboard"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="(modals)/rating"
								options={{
									title: "",
									presentation: "modal",
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="(modals)/reply/rating"
								options={{
									title: "",
									presentation: "modal",
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="(modals)/reply/comment"
								options={{
									title: "",
									presentation: "modal",
									animation: "slide_from_bottom",
								}}
							/>
						</Stack>
						<PortalHost />
					</ThemeProvider>
				</SafeAreaProvider>
			</TRPCProvider>
		</AuthProvider>
	);
}
