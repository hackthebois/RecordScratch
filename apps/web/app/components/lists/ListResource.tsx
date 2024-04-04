import { Category, ListItem } from "@recordscratch/types";
import { cn } from "@recordscratch/lib";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { AlignJustify, Star } from "lucide-react";
import { ResourceItem } from "../ResourceItem";
import { ArtistItem } from "../artist/ArtistItem";
import { DeleteButton } from "./ModifyResource";

const Review = ({
	rating,
	size = "lg",
}: {
	rating: number | null;
	size?: string;
}) => {
	if (!rating) return;

	return (
		<div className="flex flex-row items-center justify-center">
			<Star
				color="#ffb703"
				fill="#ffb703"
				size={size === "lg" ? 22 : 18}
				className="mr-2"
			/>
			<div>
				<p
					className={cn({
						"text-lg font-semibold": size === "lg",
						"font-medium": size === "sm",
						"min-w-4": true,
						"max-w-4": true,
						" text-end": true,
					})}
				>
					{rating}
				</p>
			</div>
		</div>
	);
};

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
			className="w-full"
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
					<div className="h-16 max-w-56 overflow-hidden sm:h-20 sm:max-w-lg">
						{category === "ARTIST" ? (
							<ArtistItem
								artistId={item.resourceId}
								showLink={!editMode}
								imageCss={"h-16 w-16 sm:w-20 sm:w-20"}
							/>
						) : (
							<ResourceItem
								resource={{
									parentId: item.parentId!,
									resourceId: item.resourceId,
									category: category,
								}}
								showLink={!editMode}
								imageCss={"h-16 w-16 sm:w-20 sm:w-20"}
							/>
						)}
					</div>
				</div>
				{editMode ? (
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
				) : (
					<Review rating={item.rating} />
				)}
			</div>
		</Reorder.Item>
	);
};
