import { FontAwesome6 } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/Authentication";

const IndexPage = () => {
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();
	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [isMounted, setIsMounted] = useState(false);
	const { setProfile } = useAuth();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useLayoutEffect(() => {
		if (isMounted) {
			if (!needsOnboarding) {
				setProfile(myProfile!);
				router.replace("/home");
			} else router.replace("/onboard");
		}
	}, [isMounted, needsOnboarding, router]);

	return (
		<View className="mx-auto flex min-h-[100svh] w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 sm:p-6">
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<FontAwesome6 name="compact-disc" size={200} color="black" />
		</View>
	);
};

export default IndexPage;
