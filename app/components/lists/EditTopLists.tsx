import { useState } from "react";
import { Button } from "../ui/Button";
import { Eraser, MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

export const EditTopLists = ({
	editMode,
	onClick,
}: {
	editMode: boolean;
	onClick: () => void;
}) => {
	return (
		<Button
			variant={editMode ? "default" : "outline"}
			className="-mb-5 p-3"
			onClick={() => {
				onClick();
			}}
		>
			<Eraser size={20} />
		</Button>
	);
};
