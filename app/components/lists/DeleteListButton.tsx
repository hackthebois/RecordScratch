import { api } from "@/trpc/react";
import { Button } from "../ui/Button";

export const DeleteListButton = ({
	listId,
	userId,
	onClick,
}: {
	listId: string;
	userId: string;
	onClick?: () => Promise<void>;
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
				variant="destructive"
				onClick={async () => {
					if (onClick) {
						await onClick();
					}
					deleteResource({
						id: listId,
					});
				}}
			>
				Delete
			</Button>
		</div>
	);
};
