import { ListsType } from "@/types/list";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../user/UserAvatar";
import { ScrollArea } from "../ui/ScrollArea";
import ListImage from "./ListImage";

const ListsItem = ({
	listsItem,
	size,
	showProfile = false,
	onClick,
}: {
	listsItem: ListsType;
	showProfile?: boolean;
	size: number;
	// eslint-disable-next-line no-unused-vars
	onClick?: (listId: string) => void;
}) => {
	if (!listsItem.lists.id || !listsItem.profile) return null;
	const list = listsItem.lists;
	const profile = listsItem.profile;
	const listResources = listsItem.list_resources;

	const ListItemContent = (
		<div className="flex flex-col justify-center">
			<div
				style={{
					width: size,
					height: size,
					maxWidth: size,
					maxHeight: size,
				}}
				className="flex items-center justify-center"
			>
				<ListImage
					listItems={listResources}
					category={list.category}
					size={size}
				/>
			</div>
			<p className="truncate pl-1 pt-1 text-center text-sm font-medium">
				{list.name}
			</p>
		</div>
	);

	const link = {
		to: "/lists/$listId",
		params: {
			listId: String(list.id),
		},
	};

	return (
		<div
			className="flex h-full flex-col gap-96"
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
					className="flex w-full cursor-pointer flex-col"
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
	size = 185,
}: {
	lists: ListsType[] | undefined;
	showProfiles?: boolean;
	type?: "wrap" | "scroll";
	orientation?: "vertical" | "horizontal";
	size?: number;
	// eslint-disable-next-line no-unused-vars
	onClick?: (listId: string) => void;
}) => {
	if (type === "scroll") {
		return (
			<ScrollArea className="w-full max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)]">
				<div className="flex max-h-60 flex-wrap gap-4 sm:max-h-72 md:max-h-72 lg:max-h-72 xl:max-h-72">
					{lists &&
						lists.map((list, index) => (
							<div className="mb-3" key={index}>
								<ListsItem
									listsItem={list}
									showProfile={showProfiles}
									size={size}
									onClick={onClick}
								/>
							</div>
						))}
				</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="flex flex-row flex-wrap gap-3">
				{lists &&
					lists.map((list, index) => (
						<ListsItem
							key={index}
							listsItem={list}
							showProfile={showProfiles}
							size={size}
							onClick={onClick}
						/>
					))}
			</div>
		);
	}
};

export default ListList;
