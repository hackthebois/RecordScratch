import NotFoundScreen from "@/app/+not-found";
import { Button } from "@/components/Button";
import { api } from "@/utils/api";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/app/_layout";

const removeSessionId = async () => {
	return await SecureStore.deleteItemAsync("sessionId");
};

const SettingsPage = () => {
	const { handle } = useLocalSearchParams<{ id: string; handle: string }>();
	const [profile] = api.profiles.me.useSuspenseQuery();
	const router = useRouter();
	const { logout } = useAuth();

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
					router.replace("/auth");
					logout();
				}}
			>
				Sign out
			</Button>
		</View>
	);
};

export default SettingsPage;
