import { AntDesign } from "@expo/vector-icons";
import { Text } from "~/components/CoreComponents/Text";
import { TouchableOpacity, View } from "react-native";
import { Star } from "~/lib/icons/Star";

export const RatingInput = ({
	value: rating,
	onChange,
}: {
	value: number | null;
	onChange: (_rating: number | null) => void;
}) => {
	return (
		<View className="flex justify-between flex-row gap-1">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
				<TouchableOpacity
					key={index}
					onPress={() => onChange(index)}
					className="flex flex-row items-center justify-center pt-2"
				>
					<View className="flex flex-col items-center">
						<Star
							color="orange"
							fill={rating ? (index <= rating ? "orange" : "none") : "none"}
							size={35}
						/>
						<Text className=" text-muted-foreground">{index}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};
