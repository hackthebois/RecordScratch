import { ListsType } from "@recordscratch/types";
import { FlatList, View, useWindowDimensions } from "react-native";
import ListImage from "./ListImage";
import { Link } from "expo-router";
import React from "react";
import { Text } from "../ui/text";
import ReLink from "../ReLink";

const ListsItem = ({
	listsItem,
	size,
	onPress,
	showLink = true,
}: {
	listsItem: ListsType;
	size: number;
	onPress?: (listId: string) => void;
	showLink?: boolean;
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
				<ReLink
					disabled={!showLink}
					onPress={(event) => {
						if (onPress) {
							event.preventDefault();
							onPress(listsItem.id);
						}
					}}
					href={{ pathname: `/lists/[id]`, params: { id: listsItem.id } }}
					className="flex w-full cursor-pointer flex-col"
				>
					{ListItemContent}
				</ReLink>
			}
		</View>
	);
};
const ListOfLists = ({
	size = 125,
	showLink = true,
	orientation,
	onPress,
	lists,
	HeaderComponent,
	FooterComponent,
	LastItemComponent,
	EmptyComponent,
}: {
	size?: number;
	showLink?: boolean;
	orientation?: "vertical" | "horizontal";
	onPress?: (listId: string) => void;
	lists: ListsType[] | undefined;
	HeaderComponent?: React.ReactNode;
	FooterComponent?: React.ReactNode;
	LastItemComponent?: React.ReactNode;
	EmptyComponent?: React.ReactNode;
}) => {
	if (orientation === "vertical") {
		const dimensions = useWindowDimensions();
		let listoflists;
		if (LastItemComponent) {
			const emptyList: ListsType = {
				id: "",
				userId: "",
				name: "",
				category: "ALBUM",
				resources: [],
				profile: null,
			};
			listoflists = [...(lists || []), emptyList];
		} else listoflists = lists;

		return (
			<FlatList
				data={listoflists}
				keyExtractor={(index) => index.id}
				renderItem={({ item }) => {
					if (item.id === "") return <>{LastItemComponent}</>;

					return (
						<ListsItem
							listsItem={item}
							size={dimensions.width / 3.25}
							onPress={onPress}
							showLink={showLink}
						/>
					);
				}}
				showsVerticalScrollIndicator={false}
				horizontal={false}
				columnWrapperStyle={{
					flexWrap: "wrap",
					gap: 15,
					marginBottom: 20,
				}}
				numColumns={3}
				className="h-full mt-4"
				ListHeaderComponent={() => HeaderComponent}
				ListFooterComponent={() => FooterComponent}
				ListEmptyComponent={() => EmptyComponent}
			/>
		);
	}
	return (
		<FlatList
			data={lists}
			keyExtractor={(index) => index.id}
			renderItem={({ item }) => (
				<ListsItem listsItem={item} size={size} onPress={onPress} showLink={showLink} />
			)}
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
			ListFooterComponent={() => FooterComponent}
			ListHeaderComponent={() => HeaderComponent}
		/>
	);
};

export default ListOfLists;
