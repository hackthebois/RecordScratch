import { Text } from "@/components/ui/text";
import { cn } from "@recordscratch/lib";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const StatBlock = ({
	title,
	description,
	size = "default",
	loading,
}: {
	title: string;
	description: string;
	size?: "sm" | "default";
	loading?: boolean;
}) => {
	return (
		<View
			className={cn(
				"rounded-xl border border-border gap-2",
				size === "sm" && "px-3 py-2",
				size === "default" && "px-4 py-3"
			)}
		>
			<Text className={cn("font-semibold", size === "default" && "text-lg")}>{title}</Text>
			{loading ? (
				<Skeleton>
					<Text className={cn(size === "default" && "text-lg")} />
				</Skeleton>
			) : (
				<Text className={cn(size === "default" && "text-lg")}>{description}</Text>
			)}
		</View>
	);
};

export default StatBlock;
