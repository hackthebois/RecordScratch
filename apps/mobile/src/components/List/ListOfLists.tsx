import { ListsType } from "@recordscratch/types";
import { ScrollView, View } from "react-native";
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
	// eslint-disable-next-line no-unused-vars
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

	const link = {
		href: `/lists/${String(listsItem.id)}`,
	};

	return (
		<View
			className="flex h-full flex-col gap-96"
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
					href={`/lists/${String(listsItem.id)}`}
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
	type = "scroll",
	onClick,
	size = 125,
}: {
	lists: ListsType[] | undefined;
	type?: "wrap" | "scroll";
	orientation?: "vertical" | "horizontal";
	size?: number;
	onClick?: (listId: string) => void;
}) => {
	if (type === "scroll") {
		return (
			<ScrollView className="w-full max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)]">
				<View className="flex max-h-60 flex-wrap gap-4 sm:max-h-72 md:max-h-72 lg:max-h-72 xl:max-h-72">
					{lists &&
						lists.map((list, index) => (
							<View className="mb-3" key={index}>
								<ListsItem listsItem={list} size={size} onClick={onClick} />
							</View>
						))}
				</View>
			</ScrollView>
		);
	} else {
		return (
			<View className="flex flex-row flex-wrap justify-center gap-3 sm:justify-start mt-4">
				{lists &&
					lists.map((list, index) => (
						<ListsItem key={index} listsItem={list} size={size} onClick={onClick} />
					))}
			</View>
		);
	}
};

export default ListOfLists;
