import { api } from "@/trpc/react";
import { Button } from "../ui/Button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/AlertDialog";

export const DeleteListButton = ({
	listId,
	userId,
	onClick,
}: {
	listId: string;
	userId: string;
	onClick?: () => void;
}) => {
	const utils = api.useUtils();

	const deleteResource = api.lists.delete.useMutation({
		onSettled: () => {
			utils.lists.getUser.invalidate({ userId });
			utils.lists.get.invalidate({ id: listId });
		},
	}).mutate;

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="mt-2 h-10" size="sm">
					Delete List
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete you List?</AlertDialogTitle>
					<AlertDialogDescription>
						This will remove your list forever
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
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
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
