import { FontAwesome6 } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";

const IndexPage = () => {
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();
	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	const setProfile = useAuth((s) => s.setProfile);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useLayoutEffect(() => {
		if (isMounted) {
			if (!needsOnboarding) {
				setProfile(myProfile!);
				router.navigate("/home");
			} else router.navigate("/onboard");
		}
	}, [isMounted, needsOnboarding, router]);

	return (
		<View className="mx-auto flex min-h-[100svh] w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 sm:p-6">
			<Tabs.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<FontAwesome6 name="compact-disc" size={200} color="black" />
		</View>
	);
};

export default IndexPage;
