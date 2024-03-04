import { api } from "@/trpc/react";
import { Button } from "../ui/Button";

export const ModifyListItemButton = (inputs: {
	parentId: string;
	resourceId: string;
	listId: string;
	type: "ADD" | "DELETE";
}) => {
	const utils = api.useUtils();

	if (inputs.type === "ADD") {
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
	}
	if (inputs.type === "DELETE") {
		const deleteResource =
			api.lists.resources.deleteListResource.useMutation({
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
	}
};
