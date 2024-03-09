import { useState } from "react";
import { Button } from "../ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/Dialog";
import ListList from "./ListList";
import { api } from "@/trpc/react";
import { MoreHorizontal } from "lucide-react";

export const AddToList = ({
	parentId,
	resourceId,
	category,
}: {
	parentId?: string;
	resourceId: string;
	category: "SONG" | "ALBUM" | "ARTIST";
}) => {
	const { data: myProfile } = api.profiles.me.useQuery();
	const [open, setOpen] = useState(false);

	if (!myProfile) return null;

	const { data: lists } = api.lists.getUserLists.useQuery({
		userId: myProfile.userId,
		category,
	});

	const list = api.useUtils().lists.resources.getListResources;
	const { mutate } = api.lists.resources.createListResource.useMutation({
		onSettled: (_data, _error, variables) => {
			if (variables) {
				list.invalidate({
					listId: variables.listId,
				});
			}
		},
	});

	let type: string = "";
	if (category === "SONG") type = "Song";
	if (category === "ALBUM") type = "Album";
	if (category === "ARTIST") type = "Artist";

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="ml-3 size-9 items-center gap-1 rounded"
					variant="outline"
					size="icon"
				>
					<MoreHorizontal className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">
						Add {type} to a List
					</DialogTitle>
					<DialogDescription>
						Add this {type} to one of your Lists
					</DialogDescription>
				</DialogHeader>
				<ListList
					lists={lists}
					type="scroll"
					onClick={(listId: string) => {
						mutate({
							resourceId,
							parentId,
							listId,
						});
						setOpen(false);
					}}
				/>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
