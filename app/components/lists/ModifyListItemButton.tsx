import { api } from "@/trpc/react";
import { Button } from "../ui/Button";
import { Trash2, Trash } from "lucide-react";

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
		<Button
			className="size-9"
			onClick={() =>
				deleteResource({
					...inputs,
				})
			}
			variant="outline"
			size="icon"
		>
			<Trash2 size={18} />
		</Button>
	);
};
