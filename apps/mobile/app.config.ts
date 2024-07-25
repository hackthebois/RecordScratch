import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "RecordScratch",
	slug: "recordscratch",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/logo.png",
	scheme: "myapp",
	userInterfaceStyle: "automatic",
	splash: {
		image: "./assets/logo.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/logo.png",
			backgroundColor: "#ffffff",
		},
	},
	plugins: [
		"expo-router",
		[
			"expo-font",
			{
				fonts: ["./assets/Montserrat_Variable.ttf"],
			},
		],
	],
	experiments: {
		tsconfigPaths: true,
		typedRoutes: true,
	},
	jsEngine: "hermes",
	platforms: ["ios", "android"],
});
