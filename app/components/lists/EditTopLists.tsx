import { useState } from "react";
import { Button } from "../ui/Button";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

export const EditTopLists = ({
	editMode,
	onClick,
}: {
	editMode: boolean;
	onClick: () => void;
}) => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<Popover
			onOpenChange={(open) => {
				setOpen(open);
			}}
			open={open}
		>
			<PopoverTrigger asChild>
				<Button
					className="-mb-5 size-9 items-center gap-1 rounded"
					variant="outline"
					size="icon"
				>
					<MoreHorizontal className="size-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-68">
				<Button
					variant={editMode ? "default" : "outline"}
					className="size-13"
					onClick={() => {
						onClick();
						setOpen(false);
					}}
				>
					{editMode ? (
						<p className="text-xs">Exit</p>
					) : (
						<p className="text-xs">Edit Lists</p>
					)}
				</Button>
			</PopoverContent>
		</Popover>
	);
};
