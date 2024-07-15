import React, { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/Button";
import * as Browser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Text } from "@/components/Text";
import { useAuth } from "@/utils/Authentication";
import { useRouter } from "expo-router";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const { sessionId, login } = useAuth();
	const [result, setResult] = useState("Null");
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useLayoutEffect(() => {
		if (isMounted && sessionId) {
			router.replace("(tabs)/index");
		}
	}, [isMounted, sessionId, router]);

	const _handlePressButtonAsync = async () => {
		const result = await Browser.openAuthSessionAsync(
			`https://recordscratch.app/auth/google?mobile=true`,
			`exp://10.0.0.62:8081`
		);
		setResult(result.type);

		if (result.type !== "success") return;

		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;
		login(sessionId);
	};

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
			{/* <Text className="mt-6 font-bold text-xl">{result}</Text> */}
		</View>
	);
};

export default AuthPage;
