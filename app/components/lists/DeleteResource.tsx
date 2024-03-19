import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";

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
