import { useColorScheme as useNativewindColorScheme } from "nativewind";
import * as SecureStore from "expo-secure-store";

type ColorScheme = "light" | "dark";

interface UseColorSchemeResult {
	colorScheme: ColorScheme;
	isDarkColorScheme: boolean;
	utilsColor: "white" | "black";
	setColorScheme: (scheme: ColorScheme | "system") => void;
	toggleColorScheme: () => void;
}

export function useColorScheme(): UseColorSchemeResult {
	const { colorScheme, setColorScheme: setColor, toggleColorScheme } = useNativewindColorScheme();
	const adjustedColorScheme: ColorScheme = colorScheme ?? "light";

	const setColorScheme = async (
		scheme: Parameters<(value: "light" | "dark" | "system") => void>[0]
	) => {
		setColor(scheme);
		await SecureStore.setItemAsync("theme", scheme);
	};

	return {
		colorScheme: adjustedColorScheme,
		isDarkColorScheme: adjustedColorScheme === "dark",
		utilsColor: adjustedColorScheme === "dark" ? "white" : "black",
		setColorScheme,
		toggleColorScheme,
	};
}
