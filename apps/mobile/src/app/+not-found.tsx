import { Stack, useRouter } from "expo-router";

import React from "react";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

export default function NotFoundScreen() {
	const router = useRouter();
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<View className="flex items-center justify-center h-96 gap-10">
				<Text variant="h2">This screen doesn't exist.</Text>
				<Button
					variant="secondary"
					label="Return to Home Screen"
					onPress={() => router.replace("/home")}
				/>
			</View>
		</>
	);
}
