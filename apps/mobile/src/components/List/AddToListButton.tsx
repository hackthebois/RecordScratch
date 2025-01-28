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
		href={{ pathname: "/(modals)/list/addToList", params: { resourceId, parentId, category } }}
		asChild
	>
		<Button className="size-9 items-center gap-1 rounded" variant="outline" size="icon">
			<MoreHorizontal className="size-5" />
		</Button>
	</Link>
);

export default AddToListButton;
