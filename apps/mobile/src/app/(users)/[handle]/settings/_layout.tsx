import NotFoundScreen from "#/app/+not-found";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { useAuth } from "~/lib/Authentication";
import { api } from "~/lib/api";
import { Button } from "~/components/CoreComponents/Button";

const SettingsPage = () => {
	const { handle } = useLocalSearchParams<{ id: string; handle: string }>();
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { logout } = useAuth();
	const { setColorScheme, colorScheme } = useColorScheme();

	if (!profile || profile.handle != handle) return <NotFoundScreen />;

	return (
		<View>
			<Stack.Screen
				options={{
					headerTitle: "Settings",
					headerShown: true,
				}}
			/>
			<Button
				variant="destructive"
				onPress={async () => {
					fetch("https://recordscratch.app/auth/signout");
					logout();
				}}
			>
				Sign out
			</Button>

			<Button
				variant="secondary"
				label="Toggle mode"
				onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
			/>
		</View>
	);
};

export default SettingsPage;
