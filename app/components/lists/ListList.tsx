import { ListsType } from "@/types/list";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../UserAvatar";
import { ScrollArea } from "../ui/ScrollArea";
import ListImage from "./ListImage";
import { api } from "@/trpc/react";

const ListsItem = ({
	listsItem,
	size,
	showProfile = false,
	onClick,
}: {
	listsItem: ListsType;
	showProfile?: boolean;
	size?: number;
	parentId?: string;
	resourceId?: string;
	// eslint-disable-next-line no-unused-vars
	onClick?: (listId: string) => void;
}) => {
	if (!listsItem.lists.id || !listsItem.profile) return null;
	const list = listsItem.lists;
	const profile = listsItem.profile;

	const ListItemContent = (
		<>
			<div
				style={{
					width: size,
					height: size,
					maxWidth: size,
					maxHeight: size,
				}}
			>
				<ListImage name={list.name} />
			</div>
			<p className="truncate pt-1 font-medium">{list.name}</p>
		</>
	);

	const link = {
		to: "/lists/$listId",
		params: {
			listId: String(list.id),
		},
	};

	return (
		<div
			className="flex h-full flex-col"
			style={{
				width: size,
			}}
		>
			{
				<Link
					onClick={(event) => {
						if (onClick) {
							event.preventDefault();
							onClick(list.id);
						}
					}}
					{...(onClick ? {} : link)}
					className="flex w-full cursor-pointer flex-col overflow-hidden"
				>
					{ListItemContent}
				</Link>
			}
			{showProfile && (
				<Link
					to="/$handle"
					params={{
						handle: String(profile.handle),
					}}
					className="flex flex-row space-x-1 py-1 text-sm text-muted-foreground hover:underline"
				>
					<UserAvatar {...profile} size={30} />
					<p className="flex">{profile.name}</p>
				</Link>
			)}
		</div>
	);
};

const ListList = ({
	lists,
	showProfiles = false,
	type = "scroll",
	onClick,
}: {
	lists: ListsType[];
	showProfiles?: boolean;
	type?: "wrap" | "scroll";
	// eslint-disable-next-line no-unused-vars
	onClick?: (listId: string) => void;
}) => {
	if (type === "scroll") {
		return (
			<ScrollArea
				orientation="horizontal"
				className="w-full max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)]"
			>
				<div className="flex gap-4">
					{lists.map((list, index) => (
						<div className="mb-3">
							<ListsItem
								key={index}
								listsItem={list}
								showProfile={showProfiles}
								size={144}
								onClick={onClick}
							/>
						</div>
					))}
				</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="grid grid-cols-[repeat(auto-fill,minmax(144px,1fr))] gap-3">
				{lists.map((list, index) => (
					<ListsItem
						key={index}
						listsItem={list}
						showProfile={showProfiles}
						size={144}
						onClick={onClick}
					/>
				))}
			</div>
		);
	}
};

export default ListList;
