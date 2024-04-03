import { Category, UserListItem } from "@/types/list";
import React from "react";
import SearchAddToList from "./SearchAddToList";
import { Button } from "../ui/Button";
import { DeleteButton } from "./ModifyResource";
import { api } from "@/trpc/react";

export const ResourcesList = ({
	listId,
	category,
	resources,
	editMode,
	renderItem,
	userId,
}: {
	listId: string;
	category: Category;
	resources: UserListItem[];
	editMode: boolean;
	userId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
	renderItem: (resource: UserListItem) => React.ReactNode;
}) => {
	const utils = api.useUtils();

	const { mutate: deleteResource } = api.lists.resources.delete.useMutation({
		onSettled: () => {
			utils.lists.getProfile.invalidate({ userId: userId });
		},
	});

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

			{resources.length < 6 && (
				<SearchAddToList
					category={category}
					listId={listId}
					button={
						<Button
							variant={"outline"}
							className="mb-1 h-[104px] overflow-hidden sm:mr-2 sm:h-36 sm:w-36"
						>
							Add {category.toLowerCase()}
						</Button>
					}
					onClick={() => {
						utils.lists.getProfile.invalidate({
							userId: userId,
						});
						console.log(`\n\n\nHIIIII\n\n\n`);
					}}
				/>
			)}
		</div>
	);
};
