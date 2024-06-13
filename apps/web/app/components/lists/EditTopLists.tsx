import { Button } from "../ui/Button";
import { Eraser } from "lucide-react";

export const EditTopLists = ({
	editMode,
	onClick,
}: {
	editMode: boolean;
	onClick: () => void;
}) => {
	return (
		<div className="-mb-3 w-20">
			<Button
				variant={editMode ? "default" : "outline"}
				className="-mb-5 p-3"
				onClick={() => {
					onClick();
				}}
			>
				<Eraser size={20} />
			</Button>
		</div>
	);
};
