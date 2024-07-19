import { View } from "react-native";
import { Category, ListItem } from "@recordscratch/types";
import { ArtistItem } from "#/components/Item/ArtistItem";
import { ResourceItem } from "#/components/Item/ResourceItem";
import { cn } from "@recordscratch/lib";

const ListResources = ({ items, category }: { items: ListItem[]; category: Category }) => {
	return (
		<View className="flex flex-col justify-center mb-4">
			{items.map((item, index) => (
				<View
					key={index}
					className={cn(
						"h-24 border-gray-300 ml-4 mt-2 w-full",
						index != items.length - 1 ? "border-b" : ""
					)}
				>
					{category === "ARTIST" ? (
						<ArtistItem
							artistId={item.resourceId}
							// showLink={!editMode}
							imageWidthAndHeight={75}
						/>
					) : (
						<ResourceItem
							resource={{
								parentId: item.parentId!,
								resourceId: item.resourceId,
								category: category,
							}}
							// showLink={!editMode}
							imageWidthAndHeight={75}
						/>
					)}
				</View>
			))}
		</View>
	);
};

export default ListResources;
