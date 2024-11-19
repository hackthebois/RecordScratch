import { cn } from "@recordscratch/lib";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const StatBlock = ({
	title,
	description,
	size = "default",
}: {
	title: string;
	description: string;
	size?: "sm" | "default";
}) => {
	return (
		<View
			className={cn(
				"rounded-xl border border-border",
				size === "sm" && "px-3 py-2",
				size === "default" && "px-4 py-3"
			)}
		>
			<Text className={cn("font-semibold", size === "default" && "text-lg")}>{title}</Text>
			<Text className={cn(size === "default" && "text-lg")}>{description}</Text>
		</View>
	);
};

export default StatBlock;
