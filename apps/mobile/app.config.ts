import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "RecordScratch",
	slug: "recordscratch",
	version: "0.0.2",
	orientation: "portrait",
	icon: "./assets/icon.png",
	scheme: "recordscratch",
	userInterfaceStyle: "automatic",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: "app.recordscratch.ios",
		usesAppleSignIn: true,
		entitlements: {
			"com.apple.developer.applesignin": ["Default"],
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
		package: "app.recordscratch.android",
		versionCode: 1,
	},
	plugins: [
		"expo-router",
		"expo-apple-authentication",
		[
			"@sentry/react-native/expo",
			{
				organization: "recordscratch",
				project: "recordscratch",
			},
		],
	],
	experiments: {
		tsconfigPaths: true,
		typedRoutes: true,
	},
	jsEngine: "hermes",
	platforms: ["ios", "android"],
	extra: {
		eas: {
			projectId: "7cef8d5a-7c74-45d8-909d-5202b9c533e3",
		},
	},
	owner: "recordscratch",
	updates: {
		url: "https://u.expo.dev/7cef8d5a-7c74-45d8-909d-5202b9c533e3",
	},
	runtimeVersion: {
		policy: "appVersion",
	},
});
