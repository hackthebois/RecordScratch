import { cn } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Text } from "./Text";

const DistributionChart = ({ distribution = [] }: { distribution?: number[] }) => {
	const maxRating = Math.max(...distribution) === 0 ? 1 : Math.max(...distribution);

	return (
		<View className="flex w-full flex-col rounded-md border-l border-r border-gray-300 p-6 pt-6">
			<View className="flex flex-row h-48 w-full items-end justify-between gap-1 ">
				{distribution?.map((ratings, index) => (
					<TouchableOpacity className="flex h-full flex-1 flex-col-reverse" key={index}>
						<View
							style={{
								height: `${(ratings / maxRating) * 100}%`,
							}}
							className={cn("h-full min-h-0 w-full rounded-t bg-[#ffb703]")}
						/>
					</TouchableOpacity>
				))}
			</View>
			<View className="flex flex-row w-full items-end gap-1 pt-1">
				{distribution?.map((_, index) => (
					<View
						className="flex flex-1 flex-row items-center justify-center gap-0.5"
						key={index}
					>
						<Text className="text-center text-sm text-muted-foreground text-star-orange">
							{index + 1}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export default DistributionChart;
