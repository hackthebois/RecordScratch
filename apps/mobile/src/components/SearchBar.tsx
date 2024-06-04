import { Search } from "lucide-react-native";
import { View } from "react-native-ui-lib";
import { Button } from "./Button";
import { Link, useRouter } from "expo-router";

export const SearchBar = () => {
	return (
		<View className="mr-5">
			<Link href={"/search"}>
				<Search size={20} />
			</Link>
		</View>
	);
};
