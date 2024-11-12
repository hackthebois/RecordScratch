import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";
import { catchError } from "~/lib/errors";
import { useColorScheme } from "~/lib/useColorScheme";

const SettingsPage = () => {
	const router = useRouter();
	const logout = useAuth((s) => s.logout);
	const { setColorScheme, colorScheme } = useColorScheme();
	const queryClient = useQueryClient();

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
					await queryClient.cancelQueries();
					router.navigate("(auth)/signin");
					await logout().catch(catchError);
				}}
			>
				<Text>Sign out</Text>
			</Button>
		</View>
	);
};

export default SettingsPage;
