import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem } from "@recordscratch/types";
import { View } from "react-native";
import { Text } from "../ui/text";

const ListResources = ({ items, category }: { items: ListItem[]; category: Category }) => {
	return (
		<View className="flex flex-col w-full h-full">
			{items.map((item, index) => (
				<View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{ fontSize: 12, marginLeft: 15 }}
						className="text-muted-foreground font-bold w-6"
					>
						{index + 1}
					</Text>
					{category === "ARTIST" ? (
						<ArtistItem
							artistId={item.resourceId}
							imageWidthAndHeight={60}
							showLink={false}
						/>
					) : (
						<ResourceItem
							resource={{
								parentId: item.parentId!,
								resourceId: item.resourceId,
								category: category,
							}}
							imageWidthAndHeight={60}
							titleCss="font-medium"
							showArtist={false}
							showLink={false}
							className="min-w-80 min-h-20"
						/>
					)}
				</View>
			))}
		</View>
	);
};

export default ListResources;
