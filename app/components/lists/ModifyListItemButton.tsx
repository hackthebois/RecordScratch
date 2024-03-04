import { api } from "@/trpc/react";
import { Button } from "../ui/Button";

export const DeleteListItemButton = (inputs: {
	resourceId: string;
	listId: string;
}) => {
	const utils = api.useUtils();

	const deleteResource = api.lists.resources.deleteListResource.useMutation({
		onSettled: () => {
			utils.lists.resources.getListResources.invalidate({
				listId: inputs.listId,
			});
		},
	}).mutate;
	return (
		<div>
			<Button
				className="bg-red-200"
				onClick={() =>
					deleteResource({
						...inputs,
					})
				}
			>
				Delete
			</Button>
		</div>
	);
};

export const AddListItemButton = (inputs: {
	parentId?: string;
	resourceId: string;
	listId: string;
}) => {
	const utils = api.useUtils();

	const addResource = api.lists.resources.createListResource.useMutation({
		onSettled: () => {
			utils.lists.resources.getListResources.invalidate({
				listId: inputs.listId,
			});
		},
	}).mutate;

	return (
		<div>
			<Button
				onClick={() =>
					addResource({
						...inputs,
					})
				}
			>
				ADD
			</Button>
		</div>
	);
};
