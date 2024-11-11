import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { useColorScheme } from "~/lib/useColorScheme";

const SettingsPage = () => {
	const router = useRouter();
	const logout = useAuth((s) => s.logout);
	const { setColorScheme, colorScheme } = useColorScheme();
	const utils = api.useUtils();

	return (
		<View className="p-4 gap-4">
			<Stack.Screen
				options={{
					title: "Settings",
				}}
			/>
			<Button
				variant="secondary"
				onPress={async () => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
			>
				<Text>{colorScheme === "dark" ? "Light mode" : "Dark mode"}</Text>
			</Button>
			<Button
				variant="outline"
				onPress={async () => {
					logout()
						.then(async () => {
							await utils.invalidate();
						})
						.then(() => {
							router.push("(auth)/signin");
						});
				}}
			>
				<Text>Sign out</Text>
			</Button>
		</View>
	);
};

export default SettingsPage;
