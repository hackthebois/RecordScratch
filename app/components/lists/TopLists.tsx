import { Category, UserListItem } from "@/types/list";
import React, { useState } from "react";
import SearchAddToList from "./SearchAddToList";
import { Button } from "../ui/Button";
import { DeleteButton } from "./ModifyResource";
import { api } from "@/trpc/react";
import { cn } from "@/utils/utils";

export const ResourcesList = ({
	listId,
	category,
	resources,
	editMode,
	renderItem,
	userId,
	isUser,
}: {
	listId: string | undefined;
	category: Category;
	resources: UserListItem[] | undefined;
	editMode: boolean;
	userId: string;
	isUser: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
	renderItem: (resource: UserListItem) => React.ReactNode;
}) => {
	const utils = api.useUtils();

	const { mutate: deleteResource } = api.lists.resources.delete.useMutation({
		onSettled: () => {
			utils.lists.getProfile.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});
	const { mutate: createList } = api.lists.create.useMutation({
		onSettled: () => {
			utils.lists.getProfile.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});

	const [open, setOpen] = useState<boolean>(false);

	if (!resources || !listId) {
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

							utils.lists.getProfile.invalidate({
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
		<div className="-mb-2 mt-5 flex max-h-[67.5rem] flex-row flex-wrap gap-3 sm:max-h-[26rem]">
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
								"mb-1 h-[104px] overflow-hidden sm:mr-2 sm:h-36 sm:w-36",
								category == "ARTIST" && "rounded-full"
							)}
						>
							Add {category.toLowerCase()}
						</Button>
					}
					onClick={() => {
						utils.lists.getProfile.invalidate({
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
