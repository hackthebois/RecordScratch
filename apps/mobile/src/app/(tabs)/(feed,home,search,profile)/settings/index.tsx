import { useQueryClient } from "@tanstack/react-query";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";
import { catchError } from "~/lib/errors";
import { useColorScheme } from "~/lib/useColorScheme";

const SettingsPage = () => {
	const router = useRouter();
	const logout = useAuth((s) => s.logout);
	const profile = useAuth((s) => s.profile);
	const { setColorScheme, colorScheme } = useColorScheme();
	const queryClient = useQueryClient();

	if (!profile) return <Redirect href="(auth)/signin" />;

	return (
		<ScrollView contentContainerClassName="p-4 gap-4">
			<Stack.Screen
				options={{
					title: "Settings",
				}}
			/>
			<Link href={`/settings/editprofile`} asChild>
				<Button variant="ghost">
					<Text>Edit profile</Text>
				</Button>
			</Link>
			<Button
				variant="secondary"
				onPress={async () => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
				className="flex flex-row items-center gap-2"
			>
				<Text>{colorScheme === "dark" ? "Light mode" : "Dark mode"}</Text>
			</Button>
			<Button
				variant="outline"
				onPress={async () => {
					await queryClient.cancelQueries();
					await queryClient.clear();
					await router.dismissAll();
					router.replace("(auth)/signin");
					await logout().catch(catchError);
				}}
			>
				<Text>Sign out</Text>
			</Button>
		</ScrollView>
	);
};

export default SettingsPage;
