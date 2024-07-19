import { View } from "react-native";
import { ResourceItem } from "./ResourceItem";
import { cn } from "@recordscratch/lib";

const AlbumItem = ({
	resourceId,
	className,
}: {
	total: number;
	resourceId: string;
	className?: string;
}) => {
	return (
		<View className={cn(className)}>
			<ResourceItem
				direction="vertical"
				resource={{
					resourceId: resourceId,
					category: "ALBUM",
					parentId: "",
				}}
				titleCss="line-clamp-2 w-40"
				artistNameCss="w-40 line-clamp-1"
			/>
		</View>
	);
};

export default AlbumItem;
