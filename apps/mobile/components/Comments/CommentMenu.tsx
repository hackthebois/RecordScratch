import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Trash2 } from "~/lib/icons/Trash";
import { MoreHorizontal } from "~/lib/icons/MoreHorizontal";

export const CommentMenu = ({ onPress }: { onPress: () => void }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary">
					<MoreHorizontal size={18} color="black" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-44 items-center justify-center h-16">
				<Button
					className="flex flex-row items-center justify-evenly gap-6"
					onPress={onPress}
					variant="ghost"
				>
					<Text>Delete</Text>
					<View className="flex flex-row items-center justify-center rounded-md border border-zinc-800 p-1.5">
						<Trash2 size={18} color="black" />
					</View>
				</Button>
			</PopoverContent>
		</Popover>
	);
};
