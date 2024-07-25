import { Category, UserListItem } from "@recordscratch/types";
import { ArtistItem } from "~/components/Item/ArtistItem";
import { FlatList, View } from "react-native";
import { ResourceItem } from "~/components/Item/ResourceItem";
import { cn } from "@recordscratch/lib";
import { Suspense } from "react";
import { Feather } from "@expo/vector-icons";

export const ResourceList = ({
	data,
	category,
	className,
}: {
	data?: UserListItem[] | undefined;
	category: Category;
	className?: string;
}) => {
	let renderItem;
	if (category === "ALBUM") {
		renderItem = renderAlbumItem;
	} else if (category === "SONG") {
		renderItem = renderSongItem;
	} else {
		renderItem = renderArtistItem;
	}

	const fallBackList = (
		<FlatList
			data={["0", "1", "2", "3", "4", "5"]}
			numColumns={3}
			renderItem={() => (
				<View
					className={`flex items-center justify-center rounded-md bg-muted mx-3 mb-14`}
					style={{
						width: 125,
						height: 125,
						maxWidth: 125,
						maxHeight: 125,
					}}
				>
					<Feather name="list" size={24} color="black" />
				</View>
			)}
			style={{ width: "100%" }}
			contentContainerStyle={{ alignItems: "center" }}
		/>
	);
	return (
		<Suspense fallback={fallBackList}>
			<View className={cn("flex w-full gap-2 justify-center mt-4 ml-2", className)}>
				<FlatList
					data={data}
					renderItem={renderItem}
					numColumns={3}
					keyExtractor={(item) => item.resourceId}
					style={{ width: "100%" }}
					contentContainerStyle={{ alignItems: "center" }}
				/>
			</View>
		</Suspense>
	);
};

const renderAlbumItem = ({ item: resource }: { item: UserListItem }) => (
	<View className="ml-2">
		<ResourceItem
			resource={{
				parentId: resource.parentId!,
				resourceId: resource.resourceId,
				category: "ALBUM",
			}}
			direction="vertical"
			titleCss="font-medium line-clamp-2 w-36"
			showArtist={false}
			imageWidthAndHeight={125}
		/>
	</View>
);

const renderSongItem = ({ item: resource }: { item: UserListItem }) => (
	<View className="ml-2">
		<ResourceItem
			resource={{
				parentId: resource.parentId!,
				resourceId: resource.resourceId,
				category: "SONG",
			}}
			direction="vertical"
			titleCss="font-medium line-clamp-2 w-36"
			showArtist={false}
			imageWidthAndHeight={125}
		/>
	</View>
);

const renderArtistItem = ({ item: resource }: { item: UserListItem }) => (
	<View className="mx-3 mb-14">
		<ArtistItem
			artistId={resource.resourceId}
			direction="vertical"
			textCss="font-medium line-clamp-2 text-center w-36"
			imageWidthAndHeight={125}
		/>
	</View>
);
