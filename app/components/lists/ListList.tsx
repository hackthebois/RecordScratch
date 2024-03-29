import { ListsType } from "@/types/list";
import { getImageUrl } from "@/utils/image";
import { Link } from "@tanstack/react-router";
import { ScrollArea } from "../ui/ScrollArea";
import { UserAvatar } from "../user/UserAvatar";
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
	if (!listsItem.id || !listsItem.profile) return null;
	const profile = listsItem.profile;
	const listResources = listsItem.resources;

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
					category={listsItem.category}
					size={size}
				/>
			</div>
			<p className="truncate pl-1 pt-1 text-center text-sm font-medium">
				{listsItem.name}
			</p>
		</div>
	);

	const link = {
		to: "/lists/$listId",
		params: {
			listId: String(listsItem.id),
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
							onClick(listsItem.id);
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
					<UserAvatar
						imageUrl={getImageUrl(profile)}
						className="h-8 w-8"
					/>
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
	size = 165,
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
			<div className="flex flex-row flex-wrap justify-center gap-3 sm:justify-start">
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
