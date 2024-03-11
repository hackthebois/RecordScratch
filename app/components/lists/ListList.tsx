import { ListsType } from "@/types/list";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../UserAvatar";
import { ScrollArea } from "../ui/ScrollArea";
import { api } from "@/trpc/react";
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
	parentId?: string;
	resourceId?: string;
	// eslint-disable-next-line no-unused-vars
	onClick?: (listId: string) => void;
}) => {
	if (!listsItem.lists.id || !listsItem.profile) return null;
	const list = listsItem.lists;
	const profile = listsItem.profile;
	const { data: listItems } =
		api.lists.resources.getTopFourResources.useQuery({
			listId: list.id,
		});

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
					listItems={listItems}
					category={list.category}
					size={size}
				/>
			</div>
			<p className="truncate pl-1 pt-1 font-medium">{list.name}</p>
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
}: {
	lists: ListsType[] | undefined;
	showProfiles?: boolean;
	type?: "wrap" | "scroll";
	orientation?: "vertical" | "horizontal";
	// eslint-disable-next-line no-unused-vars
	onClick?: (listId: string) => void;
}) => {
	if (type === "scroll") {
		return (
			<ScrollArea className="w-full max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)]">
				<div className="flex max-h-60 flex-wrap gap-4 self-center sm:max-h-72 md:max-h-72 lg:max-h-72 xl:max-h-72">
					{lists &&
						lists.map((list, index) => (
							<div className="mb-3" key={index}>
								<ListsItem
									listsItem={list}
									showProfile={showProfiles}
									size={100}
									onClick={onClick}
								/>
							</div>
						))}
				</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="flex flex-row flex-wrap gap-3 self-center">
				{lists &&
					lists.map((list, index) => (
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
