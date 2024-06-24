import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "@/utils/api";
import { router } from "expo-router";
import { Button } from "@/components/Button";

const IndexPage = () => {
	//const [profile] = api.profiles.me.useSuspenseQuery();
	const profile = undefined;
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();
	const navigation = useNavigation();

	React.useEffect(() => {
		if (needsOnboarding) {
			router.navigate("/onboard");
		}
	}, [needsOnboarding, navigation]);

	if (!profile) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<Text className="text-2xl font-semibold mb-4">Welcome to RecordScratch!</Text>
				<Button
					className=" rounded-md px-4 py-2"
					onPress={() => router.navigate("/auth/google")}
					label="Sign In"
					variant="secondary"
				/>
			</View>
		);
	}

	return (
		<View className="flex-1 justify-center items-center bg-white">
			<Text className="text-2xl font-semibold">Welcome back</Text>
		</View>
	);
};

export default IndexPage;
