import { cn } from "@recordscratch/lib";
import { View } from "react-native";
import { Avatar } from "react-native-ui-lib";
export const UserAvatar = ({
	imageUrl,
	size,
	className,
}: {
	imageUrl?: string;
	size?: number;
	className?: String;
}) => {
	return (
		<View className={cn(className, "h-auto")}>
			<Avatar source={{ uri: imageUrl }} size={size ?? 100} label="🤦" />
		</View>
	);
};
