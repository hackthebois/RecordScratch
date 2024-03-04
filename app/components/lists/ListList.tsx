import { ListsType } from "@/types/list";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../UserAvatar";
import { ScrollArea } from "../ui/ScrollArea";
import ListImage from "./ListImage";

const ListsItem = ({
	listsItem,
	size,
	profilePage = false,
}: {
	listsItem: ListsType;
	profilePage?: boolean;
	size?: number;
}) => {
	if (!listsItem.lists.id || !listsItem.profile) return null;
	const list = listsItem.lists;
	const profile = listsItem.profile;

	return (
		<div
			className="flex h-full flex-col"
			style={{
				width: size,
			}}
		>
			<Link
				to={"/lists/$listId"}
				params={{
					listId: String(list.id),
				}}
				className="flex w-full cursor-pointer flex-col overflow-hidden"
			>
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
			</Link>
			{!profilePage && (
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
	profilePage = false,
	type = "scroll",
}: {
	lists: ListsType[];
	profilePage?: boolean;
	type?: "wrap" | "scroll";
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
								profilePage={profilePage}
								size={144}
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
						profilePage={profilePage}
						size={144}
					/>
				))}
			</div>
		);
	}
};

export default ListList;
