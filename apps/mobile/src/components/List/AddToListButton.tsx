import { Link } from "expo-router";
import { Button } from "../ui/button";
import { MoreHorizontal } from "@/lib/icons/IconsLoader";

const AddToListButton = ({
	parentId,
	resourceId,
	category,
}: {
	parentId?: string;
	resourceId: string;
	category: "SONG" | "ALBUM" | "ARTIST";
}) => (
	<Link
		href={{
			pathname: "/(modals)/list/addToList",
			params: { resourceId, parentId, category },
		}}
		asChild
	>
		<Button
			className="items-center gap-1 rounded sm:hidden"
			variant="outline"
			size="icon"
		>
			<MoreHorizontal className="text-foreground" />
		</Button>
	</Link>
);

export default AddToListButton;
