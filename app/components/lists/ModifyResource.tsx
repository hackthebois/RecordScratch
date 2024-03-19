import { Button } from "../ui/Button";
import { Ban, Pencil, Trash2 } from "lucide-react";

export const DeleteButton = ({
	isVisible = false,
	position,
	onClick,
}: {
	isVisible: boolean;
	position: number;
	// eslint-disable-next-line no-unused-vars
	onClick: (position: number) => void;
}) => {
	return (
		isVisible && (
			<Button
				className="size-9"
				onClick={() => onClick(position)}
				variant="destructive"
				size="icon"
			>
				<Trash2 size={18} />
			</Button>
		)
	);
};

export const EditButton = ({
	editMode,
	onSave,
	onCancel,
}: {
	editMode: boolean;
	onSave: () => void;
	onCancel: () => void;
}) => {
	return (
		<div className="flex flex-row gap-2">
			<Button
				className="h-10 w-24 gap-1 rounded pb-5 pr-1 pt-5"
				onClick={onSave}
				variant={editMode ? "default" : "outline"}
				size="icon"
			>
				<Pencil size={18} />
				{editMode ? "Save List" : "Edit List"}
			</Button>
			{editMode && (
				<Button
					className="h-10 w-24 gap-1 rounded pb-5 pr-1 pt-5"
					onClick={onCancel}
					variant="outline"
					size="icon"
				>
					<Ban size={18} />
					Cancel
				</Button>
			)}
		</div>
	);
};
