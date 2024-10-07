import { api } from "@/trpc/react";
import { cn } from "@recordscratch/lib/src/utils";
import {
	Category,
	ListWithResources,
	UserListItem,
} from "@recordscratch/types/src/list";
import { useState } from "react";
import { ResourceItem } from "../ResourceItem";
import { ArtistItem } from "../artist/ArtistItem";
import { Button } from "../ui/Button";
import { DeleteButton } from "./ModifyResource";
import SearchAddToList from "./SearchAddToList";

export const ResourcesList = ({
	category,
	editMode,
	userId,
	isUser,
	list,
}: {
	category: Category;
	editMode: boolean;
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

	const [open, setOpen] = useState<boolean>(false);

	let renderItem: (resource: UserListItem) => JSX.Element;
	const resourceOptions = {
		imageCss: "min-w-[64px] rounded -mb-3",
		titleCss: "font-medium line-clamp-2",
		showArtist: false,
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
			<div className="flex flex-row">
				{isUser && (
					<Button
						variant={"outline"}
						className={cn(
							"mb-1 h-[104px] overflow-hidden sm:mr-2 sm:h-36 sm:w-36",
							category == "ARTIST" && "rounded-full"
						)}
						onClick={() => {
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
						Add {category.toLowerCase()}
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="-mb-2 mt-5 flex max-h-[67.5rem] flex-row flex-wrap justify-center gap-3 sm:max-h-[26rem] sm:justify-start">
			{resources.map((resource) => (
				<div
					className="relative mb-1 h-auto max-h-[10rem] min-h-[10rem] w-[6.5rem] overflow-hidden sm:mr-2 sm:max-h-[11.25rem] sm:min-h-[11.25rem] sm:w-36"
					key={resource.resourceId}
				>
					{renderItem(resource)}
					<DeleteButton
						isVisible={editMode}
						position={resource.position}
						className="absolute right-0.5 top-0.5"
						onClick={() => {
							deleteResource({
								resourceId: resource.resourceId,
								listId: resource.listId,
							});
						}}
					/>
				</div>
			))}

			{resources.length < 6 && isUser && (
				<SearchAddToList
					openMenu={open}
					category={category}
					listId={listId}
					button={
						<Button
							variant={"outline"}
							className={cn(
								"mb-1 h-[104px] w-[104px] overflow-hidden sm:mr-2 sm:h-36 sm:w-36",
								category == "ARTIST" && "rounded-full"
							)}
						>
							Add {category.toLowerCase()}
						</Button>
					}
					onClick={() => {
						utils.lists.topLists.invalidate({
							userId,
						});
						utils.lists.getUser.invalidate({ userId });
						if (open) setOpen(false);
					}}
				/>
			)}
		</div>
	);
};
