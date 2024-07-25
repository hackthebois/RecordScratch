import { useColorScheme as useNativewindColorScheme } from "nativewind";

type ColorScheme = "light" | "dark";

interface UseColorSchemeResult {
	colorScheme: ColorScheme;
	isDarkColorScheme: boolean;
	utilsColor: "white" | "black";
	setColorScheme: (scheme: ColorScheme | "system") => void;
	toggleColorScheme: () => void;
}

export function useColorScheme(): UseColorSchemeResult {
	const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	const adjustedColorScheme: ColorScheme = colorScheme ?? "light";

	return {
		colorScheme: adjustedColorScheme,
		isDarkColorScheme: adjustedColorScheme === "dark",
		utilsColor: adjustedColorScheme === "dark" ? "white" : "black",
		setColorScheme,
		toggleColorScheme,
	};
}
