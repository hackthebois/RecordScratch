import { View } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "#/utils/useColorScheme";

export const SearchBar = () => {
	const router = useRouter();
	const { utilsColor } = useColorScheme();
	return (
		<View className="mr-5">
			<TouchableOpacity onPress={() => router.push("/search")} className="mr-4">
				<AntDesign name="search1" size={24} color={utilsColor} />
			</TouchableOpacity>
		</View>
	);
};
