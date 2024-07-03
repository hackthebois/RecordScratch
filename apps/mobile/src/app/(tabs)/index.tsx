import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "@/utils/api";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import * as Browser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

Browser.maybeCompleteAuthSession();
const IndexPage = () => {
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
			`$recordscratch.app/auth/google?mobile=true`,
			`${Linking.createURL("")}`
		);
		setResult(result.type);

		if (result.type !== "success") return;

		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;
		await SecureStore.setItemAsync("sessionId", sessionId);
	};

	if (!profile) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<Text className="text-2xl font-semibold mb-4">Welcome to RecordScratch!</Text>
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
		<View className="flex-1 justify-center items-center bg-white">
			<Text className="text-3xl mb-4">Welcome back</Text>
			<Text className="text-2xl font-semibold">{profile.name}</Text>
		</View>
	);
};

export default IndexPage;
