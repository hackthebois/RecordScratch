import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as Browser from "expo-web-browser";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const sessionId = useAuth((s) => s.sessionId);
	const setSessionId = useAuth((s) => s.setSessionId);
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useLayoutEffect(() => {
		if (isMounted && sessionId) {
			router.replace("/");
		}
	}, [isMounted, sessionId, router]);

	const handlePressButtonAsync = async () => {
		const result = await Browser.openAuthSessionAsync(
			`${process.env.EXPO_PUBLIC_CF_PAGES_URL}/auth/google?expoAddress=${process.env.EXPO_PUBLIC_URL}`,
			`${process.env.EXPO_PUBLIC_URL}`
		);
		if (result.type !== "success") return;
		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;
		setSessionId(sessionId);
	};

	return (
		<View className="flex-1 justify-center items-center bg-white">
			<Text className="font-semibold mb-4" variant="h2">
				Welcome to RecordScratch!
			</Text>
			<Button
				className=" rounded-md px-4 py-2"
				onPress={handlePressButtonAsync}
				variant="secondary"
			>
				<Text>Sign In</Text>
			</Button>
		</View>
	);
};

export default AuthPage;
