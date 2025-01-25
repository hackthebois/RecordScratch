import { ListsType } from "@recordscratch/types";
import { FlatList, View } from "react-native";
import ListImage from "./ListImage";
import { Link } from "expo-router";
import React from "react";
import { Text } from "../ui/text";

const ListsItem = ({
	listsItem,
	size,
	onClick,
}: {
	listsItem: ListsType;
	size: number;
	onClick?: (listId: string) => void;
}) => {
	if (!listsItem.id || !listsItem.profile) return null;
	const listResources = listsItem.resources;

	const ListItemContent = (
		<View className="flex flex-col justify-center">
			<View
				style={{
					width: size,
					height: size,
					maxWidth: size,
					maxHeight: size,
				}}
				className="flex items-center justify-center"
			>
				<ListImage listItems={listResources} category={listsItem.category} size={size} />
			</View>
			<Text className="truncate pl-1 pt-1 text-center text-sm font-medium">
				{listsItem.name}
			</Text>
		</View>
	);

	return (
		<View
			className="flex flex-col gap-96"
			style={{
				width: size,
			}}
		>
			{
				<Link
					onPress={(event) => {
						if (onClick) {
							event.preventDefault();
							onClick(listsItem.id);
						}
					}}
					// {...(onClick ? {} : link)}
					href={{ pathname: `/lists/[id]`, params: { id: listsItem.id } }}
					className="flex w-full cursor-pointer flex-col"
				>
					{ListItemContent}
				</Link>
			}
		</View>
	);
};
const ListOfLists = ({
	lists,
	onPress: onClick,
	size = 125,
	orientation,
}: {
	lists: ListsType[] | undefined;
	orientation?: "vertical" | "horizontal";
	size?: number;
	onPress?: (listId: string) => void;
}) => {
	const renderItem = ({ item }: { item: ListsType }) => (
		<View className="mb-3">
			<ListsItem listsItem={item} size={size} onClick={onClick} />
		</View>
	);

	if (orientation === "vertical") {
		return (
			<FlatList
				data={lists}
				keyExtractor={(index) => index.id}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				horizontal={false}
				columnWrapperStyle={{ justifyContent: "space-around" }}
				numColumns={3}
			/>
		);
	} else {
		return (
			<FlatList
				data={lists}
				keyExtractor={(index) => index.id}
				renderItem={renderItem}
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 14,
					marginLeft: 8,
					marginVertical: 16,
				}}
				style={{ marginLeft: 10 }}
				showsHorizontalScrollIndicator={false}
				horizontal={true}
			/>
		);
	}
};

export default ListOfLists;
