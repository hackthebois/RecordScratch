import { api } from "@/trpc/react";
import { Button } from "../ui/Button";

export const DeleteListButton = ({
	listId,
	userId,
}: {
	listId: string;
	userId: string;
}) => {
	const utils = api.useUtils();

	const deleteResource = api.lists.deleteList.useMutation({
		onSettled: () => {
			utils.lists.getUserLists.invalidate({ userId });
			utils.lists.getList.invalidate({ id: listId });
		},
	}).mutate;

	return (
		<div>
			<Button
				className="bg-red-200"
				onClick={() =>
					deleteResource({
						id: listId,
					})
				}
			>
				Delete
			</Button>
		</div>
	);
};
