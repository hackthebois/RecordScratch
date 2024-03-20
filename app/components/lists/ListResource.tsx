import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Category, ListItem } from "@/types/list";
import { DeleteButton } from "./ModifyResource";
import { AlignJustify } from "lucide-react";
import { ResourceItem } from "../ResourceItem";
import { ArtistItem } from "../artist/ArtistItem";
import { cn } from "@/utils/utils";

export const ListResource = ({
	item,
	lastItem,
	category,
	position,
	editMode,
	onClick,
}: {
	item: ListItem;
	lastItem: boolean;
	category: Category;
	position: number;
	editMode: boolean;
	// eslint-disable-next-line no-unused-vars
	onClick: (position: number) => void;
}) => {
	const dragControls = useDragControls();
	const y = useMotionValue(0);

	return (
		<Reorder.Item
			value={item}
			id={item.resourceId}
			style={{ y }}
			dragListener={false}
			dragControls={dragControls}
		>
			<div
				className={cn(
					`flex flex-row items-center justify-between pb-2 pt-2`,
					lastItem ? "" : "border-b"
				)}
			>
				<div
					className={cn(
						"flex flex-row items-center",
						editMode ? "select-none" : ""
					)}
				>
					<p className=" w-4 pr-5 text-center text-sm text-muted-foreground">
						{position + 1}
					</p>
					<div className="max-w-56 overflow-hidden sm:max-w-96 ">
						{category === "ARTIST" ? (
							<ArtistItem
								artistId={item.resourceId}
								showLink={!editMode}
							/>
						) : (
							<ResourceItem
								resource={{
									parentId: item.parentId!,
									resourceId: item.resourceId,
									category: category,
								}}
								showLink={!editMode}
							/>
						)}
					</div>
				</div>
				{editMode && (
					<div className="flex flex-row items-center justify-center gap-5">
						<div
							className="reorder-handle"
							onPointerDown={(event) => {
								// For pointer devices
								dragControls.start(event);
							}}
							style={{ touchAction: "none" }}
						>
							<AlignJustify size={30} />
						</div>

						<DeleteButton
							isVisible={editMode}
							position={position}
							onClick={onClick}
						/>
					</div>
				)}
			</div>
		</Reorder.Item>
	);
};