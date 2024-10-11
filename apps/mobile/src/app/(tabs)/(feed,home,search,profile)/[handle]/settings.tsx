import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";
import * as SecureStore from "expo-secure-store";

const SettingsPage = () => {
	const router = useRouter();
	const logout = useAuth((s) => s.logout);
	const { setColorScheme, colorScheme } = useColorScheme();

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
					logout().then(() => {
						router.push("(auth)/signin");
					});
				}}
			>
				<Text>Sign out</Text>
			</Button>

			<Button
				variant="secondary"
				onPress={async () => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
			>
				<Text>Toggle mode</Text>
			</Button>
		</View>
	);
};

export default SettingsPage;
