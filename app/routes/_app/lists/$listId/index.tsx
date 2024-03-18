import { PendingComponent } from "@/components/router/Pending";
import {
	ErrorComponent,
	Link,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { api, apiUtils } from "@/trpc/react";
import { Head } from "@/components/Head";
import { NotFound } from "@/components/ui/NotFound";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { z } from "zod";
import { ResourceItem } from "@/components/ResourceItem";
import SearchAddToList from "@/components/lists/SearchAddToList";
import { ArtistItem } from "@/components/artist/ArtistItem";
import {
	DeleteButton,
	DeleteListItemButton,
} from "@/components/lists/ModifyListItemButton";
import { Label } from "@/components/ui/Label";
import { DeleteListButton } from "@/components/lists/DeleteListButton";
import { ModifyList } from "@/components/lists/UpdateList";
import ListImage from "@/components/lists/ListImage";
import { Reorder } from "framer-motion";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import ListMetadata from "@/components/lists/listMetaData";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/components/user/UserAvatar";
import { ListItem } from "@/types/list";
import { Pencil, Ban } from "lucide-react";

export const Route = createFileRoute("/_app/lists/$listId/")({
	component: List,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				tab: z.enum(["settings"]).optional(),
			})
			.parse(search);
	},
	loader: async ({ params: { listId } }) => {
		const listData = await apiUtils.lists.get.ensureData({
			id: listId,
		});
		if (!listData) return <NotFound />;

		apiUtils.lists.resources.get.ensureData({
			listId,
		});
		apiUtils.profiles.me.ensureData();
	},
});

const EditButton = ({
	editMode,
	onSave,
	onCancel,
}: {
	editMode: boolean;
	onSave: () => void;
	onCancel: () => void;
}) => {
	return (
		<div className="flex flex-row gap-2">
			<Button
				className="h-10 w-28 gap-1 rounded pb-5 pr-3 pt-5"
				onClick={onSave}
				variant={editMode ? "default" : "outline"}
				size="icon"
			>
				<Pencil size={18} />
				{editMode ? "Save List" : "Edit List"}
			</Button>
			{editMode && (
				<Button
					className="h-10 w-28 gap-1 rounded pb-5 pr-3 pt-5"
					onClick={onCancel}
					variant="outline"
					size="icon"
				>
					<Ban size={18} />
					Cancel
				</Button>
			)}
		</div>
	);
};

function List() {
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list" } = Route.useSearch();
	const { listId } = Route.useParams();

	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [listData] = api.lists.get.useSuspenseQuery({
		id: listId,
	});
	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
	});

	const utils = api.useUtils();
	const { mutate: updatePositions } =
		api.lists.resources.updatePositions.useMutation({
			onSettled: () => {
				utils.lists.resources.get.invalidate({
					listId,
				});
				utils.lists.getUser.invalidate({
					userId: listData?.profile.userId,
				});
			},
		});
	const { mutate: deletePositions } =
		api.lists.resources.multipleDelete.useMutation({
			onSettled: () => {
				utils.lists.resources.get.invalidate({
					listId,
				});
				utils.lists.getUser.invalidate({
					userId: listData?.profile.userId,
				});
			},
		});
	const [itemsOrder, setItemsOrder] = useState<ListItem[]>(listItems);
	const [editMode, setEditMode] = useState(false);
	const [deletedItems, setDeletedItems] = useState<ListItem[]>([]);
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		setItemsOrder(listItems);
		setEditMode(false);
		setIsChanged(false);
		setDeletedItems([]);
	}, [listItems]);

	if (!listData) return <NotFound />;

	const profile = listData.profile;
	const isUser = myProfile?.userId === profile.userId;

	return (
		<div className="flex flex-col gap-1">
			<Head title={listData.name} description={undefined} />
			<ListMetadata
				title={listData.name}
				type={`${listData.category} list`}
				Image={
					<ListImage
						listItems={listItems}
						category={listData.category}
						size={125}
					/>
				}
			>
				<Link
					to="/$handle"
					params={{
						handle: String(profile.handle),
					}}
					className="flex items-center gap-2"
				>
					<UserAvatar {...profile} size={30} />
					<p className="flex text-lg">{profile.name}</p>
				</Link>
			</ListMetadata>
			<Tabs value={tab} className="sm:mt-4">
				{isUser && (
					<div className="mb-4 flex flex-row">
						<TabsList className="space-x-2">
							<TabsTrigger value="list" asChild>
								<Link
									from={Route.fullPath}
									search={{
										tab: undefined,
									}}
								>
									List
								</Link>
							</TabsTrigger>
							<TabsTrigger value="settings" asChild>
								<Link
									from={Route.fullPath}
									search={{ tab: "settings" }}
								>
									Settings
								</Link>
							</TabsTrigger>
						</TabsList>
					</div>
				)}
				<TabsContent value="list">
					{isUser && (
						<div className="flex flex-row gap-2">
							<SearchAddToList
								category={listData.category}
								listId={listData.id}
							/>
							<EditButton
								editMode={editMode}
								onSave={() => {
									if (isChanged) {
										updatePositions({
											listId,
											resources: itemsOrder,
										});
										deletePositions({
											listId,
											resources: deletedItems,
										});
									}
									setEditMode(!editMode);
								}}
								onCancel={() => {
									setItemsOrder(listItems);
									setEditMode(!editMode);
									setIsChanged(false);
									setDeletedItems([]);
								}}
							/>
						</div>
					)}
					<Reorder.Group
						values={itemsOrder}
						onReorder={(props) => {
							setItemsOrder(props);
							setIsChanged(true);
						}}
					>
						{itemsOrder?.map((item, index) => (
							<Reorder.Item
								key={item.resourceId}
								value={item}
								id={item.resourceId}
								dragListener={editMode}
							>
								<div
									className={`flex flex-row items-center justify-between pb-2 pt-2 ${
										index !== itemsOrder.length - 1
											? "border-b"
											: ""
									}`}
								>
									<div className="flex flex-row items-center">
										<p className=" w-4 pr-5 text-center text-sm text-muted-foreground">
											{index + 1}
										</p>
										<div className="overflow-hidden">
											{listData.category === "ARTIST" ? (
												<ArtistItem
													artistId={item.resourceId}
												/>
											) : (
												<ResourceItem
													resource={{
														parentId:
															item.parentId!,
														resourceId:
															item.resourceId,
														category:
															listData.category,
													}}
												/>
											)}
										</div>
									</div>
									<DeleteButton
										isVisible={isUser && editMode}
										position={index}
										onClick={(position) => {
											setDeletedItems([
												...deletedItems,
												itemsOrder[position],
											]);
											setItemsOrder([
												...itemsOrder.slice(
													0,
													position
												),
												...itemsOrder.slice(
													position + 1
												),
											]);
											setIsChanged(true);
										}}
									/>
								</div>
							</Reorder.Item>
						))}
					</Reorder.Group>
				</TabsContent>
				{isUser && (
					<TabsContent value="settings">
						<div className="flex flex-col gap-8 py-6">
							<div className="flex items-center justify-between pl-4">
								<div className="flex flex-col items-start gap-2">
									<Label>Edit List</Label>
									<p className="text-sm text-muted-foreground">
										Update your list information
									</p>
								</div>
								<ModifyList
									id={listData.id}
									name={listData.name}
									description={listData.description}
								/>
							</div>
							<div className="flex items-center justify-between pl-4">
								<div className="flex flex-col items-start gap-2">
									<Label>Delete List</Label>
									<p className="text-sm text-muted-foreground">
										Delete your list and all list items
										associated
									</p>
								</div>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="destructive"
											className="mt-2 h-10"
											size="sm"
										>
											Delete List
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Delete you List?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This will remove your list
												forever
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>

											<DeleteListButton
												userId={myProfile?.userId}
												listId={listData.id}
												onClick={() =>
													navigate({
														to: `/$handle`,
														params: {
															handle: String(
																profile.handle
															),
														},
														search: {
															tab: "lists",
														},
													})
												}
											/>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
