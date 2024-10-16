import { cn } from "@recordscratch/lib";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";

const DistributionChart = ({
	distribution = [],
	value,
	onChange,
}: {
	distribution?: number[];
	value?: number;
	onChange: (rating?: number) => void;
}) => {
	const maxRating = Math.max(...distribution) === 0 ? 1 : Math.max(...distribution);

	return (
		<View className="flex w-full flex-col p-3">
			<View className="flex flex-row h-36 w-full gap-1">
				{distribution?.map((ratings, index) => (
					<TouchableOpacity
						className="flex h-full flex-1 flex-col-reverse"
						key={index}
						onPress={() => {
							if (value === index + 1) onChange(undefined);
							else onChange(index + 1);
						}}
					>
						<View
							style={{
								height: `${(ratings / maxRating) * 100}%`,
							}}
							className={cn(
								"h-full min-h-0 w-full rounded-t",
								value
									? index + 1 === value
										? "bg-[#ff8c00]"
										: "bg-[#ffb703] opacity-70"
									: "bg-[#ffb703]"
							)}
						/>
					</TouchableOpacity>
				))}
			</View>
			<View className="flex flex-row w-full gap-1 pt-2">
				{Array.from({
					length: 10,
				}).map((_, index) => (
					<View className="flex flex-1 flex-row items-center justify-center" key={index}>
						<Text>{index + 1}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export default DistributionChart;
