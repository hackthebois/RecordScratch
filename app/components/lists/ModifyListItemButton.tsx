import { api } from "@/trpc/react";
import { Button } from "../ui/Button";

// eslint-disable-next-line no-unused-vars
type MutateResource = (variables: {
	resourceId: string;
	listId: string;
}) => void;

export const ModifyListItemButton = (inputs: {
	resourceId: string;
	listId: string;
	type: "ADD" | "DELETE";
}) => {
	const utils = api.useUtils();
	let mutateResource: MutateResource;

	if (inputs.type === "ADD")
		mutateResource = api.lists.resources.createListResource.useMutation({
			onSettled: () => {
				utils.lists.resources.getListResources.invalidate({
					listId: inputs.listId,
				});
			},
		}).mutate;
	if (inputs.type === "DELETE")
		mutateResource = api.lists.resources.deleteListResource.useMutation({
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
					mutateResource({
						...inputs,
					})
				}
			>
				{inputs.type === "ADD" ? "Add" : "Delete"}
			</Button>
		</div>
	);
};
