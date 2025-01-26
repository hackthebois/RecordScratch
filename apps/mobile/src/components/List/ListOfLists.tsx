import { ListsType } from "@recordscratch/types";
import { FlatList, View, useWindowDimensions } from "react-native";
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
			<Text className="truncate pl-1 pt-1 text-center text-md font-medium">
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
	HeaderComponent,
}: {
	lists: ListsType[] | undefined;
	orientation?: "vertical" | "horizontal";
	size?: number;
	onPress?: (listId: string) => void;
	HeaderComponent?: React.ReactNode;
}) => {
	if (orientation === "vertical") {
		const dimensions = useWindowDimensions();

		const renderItem = ({ item }: { item: ListsType }) => (
			<View className="">
				<ListsItem listsItem={item} size={dimensions.width / 3.5} onClick={onClick} />
			</View>
		);

		return (
			<FlatList
				data={lists}
				keyExtractor={(index) => index.id}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				horizontal={false}
				columnWrapperStyle={{
					marginLeft: dimensions.width / 32,
					flexWrap: "wrap",
					gap: 15,
					marginBottom: 20,
				}}
				numColumns={3}
				className="h-full mt-4"
				ListHeaderComponent={() => HeaderComponent}
			/>
		);
	}
	return (
		<FlatList
			data={lists}
			keyExtractor={(index) => index.id}
			renderItem={({ item }) => <ListsItem listsItem={item} size={size} onClick={onClick} />}
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
};

export default ListOfLists;
