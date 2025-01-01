import { cn } from "@recordscratch/lib";
import { Button } from "../ui/button";
import { ArtistItem } from "../Item/ArtistItem";
import { Category, ListWithResources, UserListItem } from "@recordscratch/types";
import { ResourceItem } from "../Item/ResourceItem";
import { useState } from "react";
import { api } from "@/lib/api";
import { View } from "react-native";
import { Link } from "expo-router";
import { Text } from "@/components/ui/text";

export const ResourcesList = ({
	category,
	editMode,
	userId,
	isUser,
	list,
}: {
	category: Category;
	editMode?: boolean;
	userId: string;
	isUser: boolean;
	list: ListWithResources | undefined;
}) => {
	const listId = list?.id;
	const resources = list?.resources;
	const utils = api.useUtils();

	const { mutate: deleteResource } = api.lists.resources.delete.useMutation({
		onSettled: () => {
			utils.lists.topLists.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});
	const { mutate: createList } = api.lists.create.useMutation({
		onSettled: () => {
			utils.lists.topLists.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});

	// eslint-disable-next-line no-unused-vars
	let renderItem: (resource: UserListItem) => JSX.Element;
	const resourceOptions = {
		titleCss: "font-medium line-clamp-2",
		showArtist: false,
		className: "w-[115px]",
		imageWidthAndHeight: 115,
	};
	if (category == "ALBUM")
		renderItem = (resource: UserListItem) => (
			<ResourceItem
				resource={{
					parentId: resource.parentId!,
					resourceId: resource.resourceId,
					category: "ALBUM",
				}}
				direction="vertical"
				{...resourceOptions}
			/>
		);
	else if (category == "SONG")
		renderItem = (resource: UserListItem) => (
			<ResourceItem
				resource={{
					parentId: resource.parentId!,
					resourceId: resource.resourceId,
					category: "SONG",
				}}
				direction="vertical"
				{...resourceOptions}
			/>
		);
	else
		renderItem = (resource: UserListItem) => (
			<ArtistItem
				artistId={resource.resourceId}
				direction="vertical"
				textCss="font-medium line-clamp-2 -mt-2 text-center"
				imageCss="h-auto w-[6rem] sm:min-h-36 sm:w-36"
			/>
		);

	if (!listId || !resources) {
		return (
			<View className="flex flex-row">
				{isUser && (
					<Button
						variant={"outline"}
						className={cn(
							"mb-1 h-[115px] overflow-hidden",
							category == "ARTIST" && "rounded-full"
						)}
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
						}}
					>
						Add {category.toLowerCase()}
					</Button>
				)}
			</View>
		);
	}

	return (
		<View className="flex flex-row flex-wrap justify-center gap-6">
			{resources.map((resource) => (
				<View className="relative mb-1 h-auto overflow-hidden" key={resource.resourceId}>
					{renderItem(resource)}
					{/* <DeleteButton
						isVisible={editMode}
						position={resource.position}
						className="absolute right-0.5 top-0.5"
						onClick={() => {
							deleteResource({
								resourceId: resource.resourceId,
								listId: resource.listId,
							});
						}}
					/> */}
				</View>
			))}

			{resources.length < 6 && isUser && (
				<Link
					href={{
						pathname: "(modals)/searchResource",
						params: {
							category: category,
							listId: listId,
						},
					}}
					asChild
				>
					<Button
						variant="secondary"
						className="min-w-[115px] min-h-[115px] gap-1 rounded-lg"
					>
						<Text>Add a Song</Text>
					</Button>
				</Link>
			)}
		</View>
	);
};
