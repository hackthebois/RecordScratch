import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as Browser from "expo-web-browser";
import React from "react";
import { Pressable, View } from "react-native";
// import googleLogo from "~/assets/google-logo.svg";
import { Text } from "~/components/ui/text";
import env from "~/env";
import { useAuth } from "~/lib/auth";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const login = useAuth((s) => s.login);
	const router = useRouter();

	const handlePressButtonAsync = async (adapter: "google" | "apple") => {
		const result = await Browser.openAuthSessionAsync(
			`${env.SITE_URL}/api/auth/${adapter}?expoAddress=${env.SCHEME}`,
			`${env.SCHEME}`
		);
		if (result.type !== "success") return;
		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;

		await login(sessionId);
		router.navigate("(tabs)/");
	};

	return (
		<View className="flex-1 justify-center items-center gap-6">
			<Image
				source={require("../../../assets/icon.png")}
				style={{
					width: 150,
					height: 150,
				}}
			/>
			<Text variant="h1" className="text-center text-4xl">
				Welcome to RecordScratch
			</Text>
			<Pressable
				onPress={async () => await handlePressButtonAsync("google")}
				className="px-8 py-4 rounded-full border border-border flex-row gap-4 items-center"
			>
				<Image
					source={require("../../../assets/google-logo.svg")}
					style={{
						width: 30,
						height: 30,
					}}
				/>
				<Text className="text-lg font-medium">Sign in with Google</Text>
			</Pressable>
			<Pressable
				onPress={async () => await handlePressButtonAsync("apple")}
				className="px-8 py-4 rounded-full border border-border flex-row gap-4 items-center"
			>
				<Image
					source={require(`../../../assets/apple_black.svg`)}
					style={{
						width: 26,
						height: 30,
					}}
				/>
				<Text className="text-lg font-medium">Sign in with Apple</Text>
			</Pressable>
		</View>
	);
};

export default AuthPage;
