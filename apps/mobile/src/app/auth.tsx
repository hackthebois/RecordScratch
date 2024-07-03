import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "@/utils/api";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import * as Browser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { Text } from "@/components/Text";
import { useAuth } from "./_layout";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const { login } = useAuth();
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();
	const navigation = useNavigation();

	React.useEffect(() => {
		if (needsOnboarding) {
			router.navigate("/onboard");
		}
	}, [needsOnboarding, navigation]);

	const [result, setResult] = useState("");

	const _handlePressButtonAsync = async () => {
		const result = await Browser.openAuthSessionAsync(
			`https://recordscratch.app/auth/google?mobile=true`,
			`exp://10.0.0.62:8081/auth`
		);
		setResult(result.type);

		if (result.type !== "success") return;

		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;
		login(sessionId);
	};

	if (!profile) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<Text className="font-semibold mb-4" variant="h2">
					Welcome to RecordScratch!
				</Text>
				<Button
					className=" rounded-md px-4 py-2"
					onPress={_handlePressButtonAsync}
					label="Sign In"
					variant="secondary"
				/>
				<Text className="mt-6 font-bold text-xl">{result}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 justify-center items-center bg-white gap-4">
			<Text className="font-semibold mb-4" variant="h1">
				Welcome back
			</Text>
			<Text className=" font-medium" variant="h1">
				{profile.name}
			</Text>
			<Button
				variant="secondary"
				label="Return to Home Screen"
				onPress={() => router.replace("/home")}
			/>
		</View>
	);
};

export default AuthPage;
