import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native-ui-lib";

export const SearchBar = () => {
	const router = useRouter();
	return (
		<View className="mr-5">
			<TouchableOpacity onPress={() => router.push("/search")} className="mr-4">
				<Search size={24} className="text-foreground" />
			</TouchableOpacity>
		</View>
	);
};
