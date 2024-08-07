import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Star } from "~/lib/icons/Star";

export const RatingInput = ({
	value: rating,
	onChange,
}: {
	value: number | null;
	onChange: (_rating: number | null) => void;
}) => {
	return (
		<View className="flex justify-between flex-row">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
				<TouchableOpacity
					key={index}
					onPress={() => onChange(index)}
					className="flex flex-row items-center justify-center pt-2"
				>
					<View className="flex flex-col items-center">
						{rating ? (
							index <= rating ? (
								<Star size={24} color="#ffb703" fill="#ffb703" />
							) : (
								<Star size={24} color="#ffb703" />
							)
						) : (
							<Star size={24} color="#ffb703" />
						)}
						<Text className=" text-muted-foreground">{index}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};
