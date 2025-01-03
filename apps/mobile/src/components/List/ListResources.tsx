import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { cn } from "@recordscratch/lib";
import { Category, ListItem } from "@recordscratch/types";
import { View } from "react-native";
import { Text } from "../ui/text";

const ListResources = ({ items, category }: { items: ListItem[]; category: Category }) => {
	return (
		<View className="flex flex-col justify-center mb-4">
			{items.map((item, index) => (
				<View
					key={index}
					className={cn(
						"flex flex-row items-center ml-4 mt-2 gap-4 min-h-24 border-gray-300",
						index != items.length - 1 ? "border-b" : ""
					)}
				>
					<Text className="text-muted-foreground font-bold w-6">{index + 1}</Text>
					{category === "ARTIST" ? (
						<ArtistItem artistId={item.resourceId} imageWidthAndHeight={75} />
					) : (
						<ResourceItem
							resource={{
								parentId: item.parentId!,
								resourceId: item.resourceId,
								category: category,
							}}
							imageWidthAndHeight={75}
							titleCss="font-medium"
							showArtist={false}
							className="min-w-96"
						/>
					)}
				</View>
			))}
		</View>
	);
};

export default ListResources;
