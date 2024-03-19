import { api } from "@/trpc/react";
import { Button } from "../ui/Button";

export const DeleteListButton = ({
	listId,
	userId,
	onClick,
}: {
	listId: string;
	userId: string;
	onClick?: () => unknown;
}) => {
	const utils = api.useUtils();

	const deleteResource = api.lists.delete.useMutation({
		onSettled: () => {
			utils.lists.getUser.invalidate({ userId });
			utils.lists.get.invalidate({ id: listId });
		},
	}).mutate;

	return (
		<Button
			variant="destructive"
			onClick={() => {
				if (onClick) {
					onClick();
				}
				deleteResource({
					id: listId,
				});
			}}
		>
			Delete
		</Button>
	);
};
