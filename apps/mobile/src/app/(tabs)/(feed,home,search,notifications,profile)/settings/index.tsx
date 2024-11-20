import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/auth";
import { catchError } from "@/lib/errors";
import { Moon } from "@/lib/icons/Moon";
import { Sun } from "@/lib/icons/Sun";
import { User } from "@/lib/icons/User";
import { useColorScheme } from "@/lib/useColorScheme";
import { useQueryClient } from "@tanstack/react-query";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import { ScrollView } from "react-native";

const SettingsPage = () => {
	const router = useRouter();
	const logout = useAuth((s) => s.logout);
	const profile = useAuth((s) => s.profile);
	const { setColorScheme, colorScheme } = useColorScheme();
	const queryClient = useQueryClient();

	if (!profile) return <Redirect href="/(auth)/signin" />;

	return (
		<ScrollView contentContainerClassName="p-4 gap-4">
			<Stack.Screen
				options={{
					title: "Settings",
				}}
			/>
			<Link href={`/settings/editprofile`} asChild>
				<Button variant="outline" className="gap-2 flex-row justify-between">
					<Text>Edit Profile</Text>
					<User className="text-muted-foreground" size={18} />
				</Button>
			</Link>
			<Button
				variant="outline"
				onPress={async () => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
				className="flex-row items-center gap-2 justify-between"
			>
				<Text>Toggle Theme</Text>
				{colorScheme === "light" ? (
					<Sun className="text-muted-foreground" size={18} />
				) : (
					<Moon className="text-muted-foreground" size={18} />
				)}
			</Button>
			<Button
				variant="secondary"
				onPress={async () => {
					await queryClient.cancelQueries();
					await queryClient.clear();
					await router.dismissAll();
					router.replace("/(auth)/signin");
					await logout().catch(catchError);
				}}
			>
				<Text>Sign Out</Text>
			</Button>
		</ScrollView>
	);
};

export default SettingsPage;
