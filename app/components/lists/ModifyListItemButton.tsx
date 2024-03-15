import { api } from "@/trpc/react";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";

export const DeleteListItemButton = (inputs: {
	resourceId: string;
	listId: string;
}) => {
	const utils = api.useUtils();

	const { mutate: deleteResource } = api.lists.resources.delete.useMutation({
		onSettled: () => {
			utils.lists.resources.get.invalidate({
				listId: inputs.listId,
			});
		},
	});
	return (
		<Button
			className="size-9"
			onClick={() =>
				deleteResource({
					...inputs,
				})
			}
			variant="destructive"
			size="icon"
		>
			<Trash2 size={18} />
		</Button>
	);
};
