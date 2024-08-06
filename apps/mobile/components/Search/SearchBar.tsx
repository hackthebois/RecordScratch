import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native-ui-lib";
import { useColorScheme } from "~/lib/useColorScheme";

export const SearchBar = () => {
	const router = useRouter();
	const { utilsColor } = useColorScheme();
	return (
		<View className="mr-5">
			<TouchableOpacity onPress={() => router.push("/search")} className="mr-4">
				<Search size={24} color={utilsColor} />
			</TouchableOpacity>
		</View>
	);
};
