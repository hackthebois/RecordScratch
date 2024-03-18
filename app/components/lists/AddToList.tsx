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
import { CreateList } from "./CreateList";

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

	const { data: lists } = api.lists.getUser.useQuery({
		userId: myProfile.userId,
		category,
	});

	const list = api.useUtils().lists.resources.get;
	const { mutate } = api.lists.resources.create.useMutation({
		onSettled: (_data, _error, variables) => {
			if (variables) {
				list.invalidate({
					listId: variables.listId,
				});
			}
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="size-9 items-center gap-1 rounded"
					variant="outline"
					size="icon"
				>
					<MoreHorizontal className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">
						Add {category.toLowerCase()} to a List
					</DialogTitle>
					<DialogDescription>
						Add this {category.toLowerCase()} to one of your Lists
					</DialogDescription>
				</DialogHeader>
				{!lists?.length ? (
					<CreateList size={165} category={category} />
				) : (
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
						size={165}
					/>
				)}
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
