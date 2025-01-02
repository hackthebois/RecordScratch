import { cn } from "@recordscratch/lib";
import { Button } from "../ui/button";
import { Trash2 } from "@/lib/icons/IconsLoader";

export const DeleteButton = ({
	isVisible = false,
	position,
	onPress,
	className,
}: {
	isVisible: boolean;
	position: number;
	className?: string;
	onPress: (position: number) => void;
}) => {
	return (
		isVisible && (
			<Button
				className={cn("size-9", className)}
				onPress={() => onPress(position)}
				variant="destructive"
				size="icon"
			>
				<Trash2 size={18} />
			</Button>
		)
	);
};
