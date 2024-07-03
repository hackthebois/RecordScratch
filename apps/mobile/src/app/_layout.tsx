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
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../styles.css";
import * as SecureStore from "expo-secure-store";

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

// Define the context type
interface AuthContextType {
	sessionId: string | null;
	login: (id: string) => Promise<void>;
	logout: () => Promise<void>;
}

// Create the Auth context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

const getSessionId = async () => {
	return await SecureStore.getItemAsync("sessionId");
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSessionId = async () => {
			const id = await getSessionId();
			setSessionId(id);
			setLoading(false);
		};

		fetchSessionId();
	}, []);

	const login = async (id: string) => {
		await SecureStore.setItemAsync("sessionId", id);
		setSessionId(id);
	};

	const logout = async () => {
		await SecureStore.deleteItemAsync("sessionId");
		setSessionId(null);
	};

	if (loading) {
		return null; // or some loading spinner/component
	}

	return (
		<AuthContext.Provider value={{ sessionId, login, logout }}>
			{sessionId ? (
				children
			) : (
				<Stack
					screenOptions={{
						animation: "slide_from_right",
						headerTitleAlign: "center",
					}}
				>
					<Stack.Screen
						name="auth"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			)}
		</AuthContext.Provider>
	);
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
		<TRPCProvider>
			<SafeAreaProvider>
				<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
					<AuthProvider>
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
						</Stack>
					</AuthProvider>
				</ThemeProvider>
			</SafeAreaProvider>
		</TRPCProvider>
	);
}
