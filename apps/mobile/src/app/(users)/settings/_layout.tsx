import NotFoundScreen from "#/app/+not-found";
import { Stack, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/Authentication";
import { api } from "~/lib/api";

const SettingsPage = () => {
	const { clearSessionId, myProfile } = useAuth();
	const { setColorScheme, colorScheme } = useColorScheme();

	if (!myProfile) return <NotFoundScreen />;

	return (
		<View className="p-4 gap-4">
			<Stack.Screen
				options={{
					title: "Settings",
				}}
			/>
			<Button
				variant="destructive"
				onPress={async () => {
					fetch("https://recordscratch.app/auth/signout");
					clearSessionId();
				}}
			>
				<Text>Sign out</Text>
			</Button>

			<Button
				variant="secondary"
				onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
			>
				<Text>Toggle mode</Text>
			</Button>
		</View>
	);
};

export default SettingsPage;
