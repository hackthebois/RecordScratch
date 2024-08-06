import { Category, UserListItem } from "@recordscratch/types";
import { ArtistItem } from "~/components/Item/ArtistItem";
import { FlatList, View } from "react-native";
import { ResourceItem } from "~/components/Item/ResourceItem";
import { cn } from "@recordscratch/lib";
import { Suspense, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import SearchAddToList from "../Search/SearchAddToList";
import { Button } from "../ui/button";
import { api } from "~/lib/api";
import { Text } from "../ui/text";

export const ResourceList = ({
	data,
	category,
	className,
	userId,
	listId,
	isProfile,
}: {
	data?: UserListItem[] | undefined;
	category: Category;
	className?: string;
	userId: string;
	listId: string | undefined;
	isProfile: boolean;
}) => {
	const [open, setOpen] = useState<boolean>(false);
	const localData = data ?? [];

	let renderItem;
	if (category === "ALBUM") {
		renderItem = renderAlbumItem;
	} else if (category === "SONG") {
		renderItem = renderSongItem;
	} else {
		renderItem = renderArtistItem;
	}

	return (
		<Suspense fallback={fallBackList}>
			<View className={cn("flex w-full gap-2 justify-center mt-4 ", className)}>
				<FlatList
					data={[...localData, AddToListItem]}
					renderItem={({ item }) => (
						<>
							{!listId ? (
								<CreateTopList
									userId={userId}
									category={category}
									setOpen={setOpen}
								/>
							) : !item.listId && localData.length < 6 && isProfile ? (
								<RenderAddToList
									listId={listId}
									userId={userId}
									category={category}
									open={open}
								/>
							) : (
								renderItem({ item })
							)}
						</>
					)}
					numColumns={3}
					keyExtractor={(item, index) => item.resourceId || index.toString()}
					style={{ width: "100%" }}
					columnWrapperStyle={{ justifyContent: "space-around" }}
					contentContainerStyle={{ marginHorizontal: "2%" }}
				/>
			</View>
		</Suspense>
	);
};

const AddToListItem = {
	listId: "",
	resourceId: "",
	position: 0,
	parentId: "",
	createdAt: undefined,
	updatedAt: undefined,
};

const fallBackList = (
	<FlatList
		data={["0", "1", "2", "3", "4", "5"]}
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
		numColumns={3}
		style={{ width: "100%" }}
		columnWrapperStyle={{ justifyContent: "space-between" }}
		contentContainerStyle={{ marginHorizontal: "2%" }}
	/>
);

const CreateTopList = ({
	category,
	userId,
	setOpen,
}: {
	category: Category;
	userId: string;
	setOpen: (_: boolean) => void;
}) => {
	const { mutate: createList } = api.lists.create.useMutation({
		onSettled: () => {
			utils.lists.topLists.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});
	const utils = api.useUtils();
	return (
		<Button
			variant="secondary"
			className={cn("rounded-lg", category == "ARTIST" && "rounded-full")}
			style={{
				width: 125,
				height: 125,
				maxWidth: 125,
				maxHeight: 125,
			}}
			onPress={() => {
				createList({
					name: `My Top 6 ${category.toLowerCase()}s`,
					category,
					onProfile: true,
				});

				utils.lists.topLists.invalidate({
					userId,
				});

				utils.lists.getUser.invalidate({ userId });

				setOpen(true);
			}}
		>
			<Text>Add {category.toLowerCase()}</Text>
		</Button>
	);
};

const RenderAddToList = ({
	category,
	listId,
	userId,
	open,
}: {
	category: Category;
	listId: string;
	userId: string;
	open: boolean;
}) => {
	const utils = api.useUtils();

	return (
		<View className={cn(category === "ARTIST" ? "mx-3 mb-14" : "mx-2")}>
			<SearchAddToList
				category={category}
				listId={listId}
				openMenu={open}
				button={
					<Button
						variant="secondary"
						className={cn("rounded-lg", category == "ARTIST" && "rounded-full")}
						style={{
							width: 125,
							height: 125,
							maxWidth: 125,
							maxHeight: 125,
						}}
					>
						<Text>Add {category.toLowerCase()}</Text>
					</Button>
				}
				onPress={() => {
					utils.lists.topLists.invalidate({
						userId,
					});
					utils.lists.getUser.invalidate({ userId });
				}}
			/>
		</View>
	);
};

const renderAlbumItem = ({ item: resource }: { item: UserListItem }) => {
	if (!resource.listId) return null;

	return (
		<View className="ml-2">
			<ResourceItem
				resource={{
					parentId: resource.parentId!,
					resourceId: resource.resourceId,
					category: "ALBUM",
				}}
				direction="vertical"
				titleCss="font-medium line-clamp-2 w-36 text-center"
				showArtist={false}
				imageWidthAndHeight={125}
			/>
		</View>
	);
};

const renderSongItem = ({ item: resource }: { item: UserListItem }) => {
	if (!resource.listId) return null;

	return (
		<View className="ml-2">
			<ResourceItem
				resource={{
					parentId: resource.parentId!,
					resourceId: resource.resourceId,
					category: "SONG",
				}}
				direction="vertical"
				titleCss="font-medium line-clamp-2 w-36 text-center"
				showArtist={false}
				imageWidthAndHeight={125}
			/>
		</View>
	);
};

const renderArtistItem = ({ item: resource }: { item: UserListItem }) => {
	if (!resource.listId) return null;

	return (
		<View className="mx-3 mb-14">
			<ArtistItem
				artistId={resource.resourceId}
				direction="vertical"
				textCss="font-medium line-clamp-2 text-center w-36"
				imageWidthAndHeight={125}
			/>
		</View>
	);
};
