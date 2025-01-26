import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@recordscratch/lib";
import { Category, ListWithResources, UserListItem } from "@recordscratch/types";
import { Link } from "expo-router";
import { Dimensions, View } from "react-native";
import { ArtistItem } from "../Item/ArtistItem";
import { ResourceItem } from "../Item/ResourceItem";
import { Button } from "../ui/button";
import { DeleteButton } from "./ModifyResource";

const Resource = ({
	resource,
	category,
	top6Width,
}: {
	resource: UserListItem;
	category: Category;
	top6Width: number;
}) => {
	return category != "ARTIST" ? (
		<ResourceItem
			resource={{
				parentId: resource.parentId!,
				resourceId: resource.resourceId,
				category,
			}}
			direction="vertical"
			titleCss="font-medium line-clamp-2 text-center text-base"
			showArtist={false}
			imageWidthAndHeight={top6Width}
			width={top6Width}
		/>
	) : (
		<ArtistItem
			artistId={resource.resourceId}
			direction="vertical"
			textCss="font-medium line-clamp-2 -mt-2 text-center text-base"
			imageWidthAndHeight={top6Width}
		/>
	);
};

export const TopList = ({
	category,
	editMode,
	isUser,
	list,
	setEditMode,
}: {
	category: Category;
	editMode: boolean;
	isUser: boolean;
	list: ListWithResources | undefined;
	setEditMode: (edit: boolean) => void;
}) => {
	const listId = list?.id;
	const resources = list?.resources;
	const utils = api.useUtils();
	const userId = useAuth((s) => s.profile!.userId);
	const windowWidth = Dimensions.get("window").width;
	const top6Width = windowWidth / 4;

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

	if (!listId || !resources) {
		return (
			<View className="flex flex-row flex-wrap gap-5" style={{ height: top6Width * 3.5 }}>
				<Link
					href={{
						pathname: "/(modals)/searchResource",
						params: {
							category: category,
							listId: listId,
							isTopList: "true",
						},
					}}
					asChild
				>
					{isUser && (
						<Button
							variant={"outline"}
							className={cn(
								"gap-1 rounded-lg",
								category == "ARTIST" && "rounded-full"
							)}
							style={{ width: top6Width, height: top6Width }}
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
								setEditMode(false);
							}}
						>
							<Text className="capitalize w-20 text-center">
								Add {category.toLowerCase()}
							</Text>
						</Button>
					)}
				</Link>
			</View>
		);
	}

	return (
		<View
			className="flex flex-row flex-wrap gap-5"
			style={{
				marginLeft: resources.length > 0 ? top6Width / 4 : 0,
				height: top6Width * 3.5,
			}}
		>
			{resources.map((resource) => (
				<View className="relative mb-1 h-auto overflow-hidden" key={resource.resourceId}>
					<Resource resource={resource} category={category} top6Width={top6Width} />
					<DeleteButton
						isVisible={editMode}
						position={resource.position}
						className="absolute right-0.5 top-0.5"
						onPress={() => {
							deleteResource({
								resourceId: resource.resourceId,
								listId: resource.listId,
							});
							if (resources.length === 1) setEditMode(false);
						}}
					/>
				</View>
			))}

			{resources.length < 6 && isUser && (
				<Link
					href={{
						pathname: "/(modals)/searchResource",
						params: {
							category: category,
							listId: listId,
							isTopList: "true",
						},
					}}
					asChild
				>
					<Button
						variant={"outline"}
						className={cn(
							"gap-1 item",
							category === "ARTIST" ? "rounded-full" : "rounded-lg"
						)}
						style={{ width: top6Width, height: top6Width }}
						onPress={() => setEditMode(false)}
					>
						<Text className="capitalize w-20 text-center">
							Add {category.toLowerCase()}
						</Text>
					</Button>
				</Link>
			)}
		</View>
	);
};
