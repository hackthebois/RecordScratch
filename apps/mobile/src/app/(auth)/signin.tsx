import { Text } from "@/components/ui/text";
import env from "@/env";
import { useAuth } from "@/lib/auth";
import { catchError } from "@/lib/errors";
import { useColorScheme } from "@/lib/useColorScheme";
import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as Browser from "expo-web-browser";
import React from "react";
import { Pressable, View } from "react-native";
import { z } from "zod";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const login = useAuth((s) => s.login);
	const router = useRouter();
	const { colorScheme } = useColorScheme();

	const handlePressButtonAsync = async (adapter: "google") => {
		const result = await Browser.openAuthSessionAsync(
			`${env.SITE_URL}/api/auth/${adapter}?expoAddress=${env.SCHEME}`,
			`${env.SCHEME}`
		);
		if (result.type !== "success") return;
		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;

		await login(sessionId).catch(catchError);
		router.navigate("(tabs)/");
	};

	const appleLogo = {
		light: require("../../../assets/apple_black.svg"),
		dark: require("../../../assets/apple_white.svg"),
	};

	return (
		<View className="flex-1 justify-center items-center gap-6">
			<Image
				source={require("../../../assets/icon.png")}
				style={{
					width: 150,
					height: 150,
					borderRadius: 9999,
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
				onPress={async () => {
					try {
						const credential = await AppleAuthentication.signInAsync({
							requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
						});
						const { identityToken, email } = credential;

						const res = await fetch(`${env.SITE_URL}/api/auth/apple/mobile/callback`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								idToken: identityToken,
								email: email ?? undefined,
							}),
						});
						const { sessionId } = z
							.object({
								sessionId: z.string(),
							})
							.parse(await res.json());

						await login(sessionId).catch(catchError);
						router.navigate("(tabs)/");
					} catch (e) {
						console.error(e);
					}
				}}
				className="px-8 py-4 rounded-full border border-border flex-row gap-4 items-center"
			>
				<Image
					key={colorScheme}
					source={colorScheme === "dark" ? appleLogo.dark : appleLogo.light}
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
