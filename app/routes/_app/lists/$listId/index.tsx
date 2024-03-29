import { Head } from "@/components/Head";
import Metadata from "@/components/Metadata";
import { DeleteListButton } from "@/components/lists/DeleteListButton";
import ListImage from "@/components/lists/ListImage";
import { ListResource } from "@/components/lists/ListResource";
import { EditButton } from "@/components/lists/ModifyResource";
import SearchAddToList from "@/components/lists/SearchAddToList";
import { ModifyList } from "@/components/lists/UpdateList";
import { PendingComponent } from "@/components/router/Pending";
import { Label } from "@/components/ui/Label";
import { NotFound } from "@/components/ui/NotFound";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { UserAvatar } from "@/components/user/UserAvatar";
import { api, apiUtils } from "@/trpc/react";
import { ListItem, ListType } from "@/types/list";
import { Profile } from "@/types/profile";
import { timeAgo } from "@/utils/date";
import { getImageUrl } from "@/utils/image";
import {
	ErrorComponent,
	Link,
	UseNavigateResult,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { z } from "zod";

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
			userId: listData!.userId,
		});
		apiUtils.profiles.me.ensureData();
	},
});

const ListSettings = ({
	listData,
	myProfile,
	navigate,
}: {
	listData: ListType;
	myProfile: Profile;
	navigate: UseNavigateResult<"/lists/$listId">;
}) => {
	return (
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
					description={listData.description ?? ""}
					onProfile={listData.onProfile!}
				/>
			</div>
			<div className="flex items-center justify-between pl-4">
				<div className="flex flex-col items-start gap-2">
					<Label>Delete List</Label>
					<p className="text-sm text-muted-foreground">
						Delete your list and all list items associated
					</p>
				</div>
				<DeleteListButton
					userId={myProfile.userId}
					listId={listData.id}
					onClick={() =>
						navigate({
							to: `/$handle`,
							params: {
								handle: String(myProfile.handle),
							},
							search: {
								tab: "lists",
							},
						})
					}
				/>
			</div>
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
		userId: listData!.userId,
	});

	const invalidate = async () => {
		await utils.lists.resources.get.invalidate({
			listId,
		});
		await utils.lists.getUser.invalidate({
			userId: listData?.profile.userId,
		});
	};

	const utils = api.useUtils();
	const { mutateAsync: updatePositions } =
		api.lists.resources.updatePositions.useMutation();
	const { mutateAsync: deletePositions } =
		api.lists.resources.multipleDelete.useMutation();

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

	const handleSave = async () => {
		setEditMode((prevEditMode) => !prevEditMode);
		if (isChanged) {
			await updatePositions({
				listId,
				resources: itemsOrder,
			});
			if (deletedItems.length) {
				await deletePositions({
					listId,
					resources: deletedItems,
				});
			}
			await invalidate();
		}
	};

	const handleCancel = () => {
		setItemsOrder(listItems);
		setEditMode((prevEditMode) => !prevEditMode);
		setIsChanged(false);
		setDeletedItems([]);
	};

	if (!listData) return <NotFound />;

	const profile = listData.profile;
	const isUser = myProfile?.userId === profile.userId;

	return (
		<div className="flex flex-col gap-1">
			<Head title={listData.name} description={undefined} />
			<Metadata
				title={listData.name}
				type={`${listData.category} list`}
				cover={
					<ListImage
						listItems={listItems}
						category={listData.category}
						size={150}
					/>
				}
				size="sm"
			>
				<div className="flex items-center gap-2">
					<Link
						to="/$handle"
						params={{
							handle: String(profile.handle),
						}}
						className="flex items-center gap-2"
					>
						<UserAvatar
							imageUrl={getImageUrl(profile)}
							className="h-8 w-8"
						/>
						<p className="flex text-lg">{profile.name}</p>
					</Link>
					<p className="text-muted-foreground">
						• {timeAgo(listData.updatedAt)}
					</p>
				</div>
			</Metadata>
			<Tabs value={tab} className="mt-4">
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
								onSave={handleSave}
								onCancel={handleCancel}
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
							<ListResource
								key={item.resourceId}
								item={item}
								lastItem={index === itemsOrder.length - 1}
								category={listData.category}
								position={index}
								editMode={editMode}
								onClick={(position) => {
									setDeletedItems([
										...deletedItems,
										itemsOrder[position],
									]);
									setItemsOrder([
										...itemsOrder.slice(0, position),
										...itemsOrder.slice(position + 1),
									]);
									setIsChanged(true);
								}}
							/>
						))}
					</Reorder.Group>
				</TabsContent>
				{isUser && (
					<TabsContent value="settings">
						<ListSettings
							listData={listData}
							myProfile={myProfile}
							navigate={navigate}
						/>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
