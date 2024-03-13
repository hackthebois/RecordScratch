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
import { DeleteListItemButton } from "@/components/lists/ModifyListItemButton";
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
import { useState } from "react";
import { UserAvatar } from "@/components/user/UserAvatar";

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
	const [itemsOrder, setItemsOrder] = useState(listItems);

	if (!listData) return <NotFound />;

	const profile = listData?.profile;
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
					<UserAvatar {...profile} size={40} />
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
						<SearchAddToList
							category={listData.category}
							listId={listData.id}
						/>
					)}
					{listData.category === "ARTIST" && itemsOrder && (
						<Reorder.Group
							values={itemsOrder}
							onReorder={setItemsOrder}
						>
							{itemsOrder?.map((artist, index) => (
								<Reorder.Item
									key={artist.resourceId}
									value={artist}
									id={artist.resourceId}
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
											<ArtistItem
												artistId={artist.resourceId}
											/>
										</div>
										{isUser && (
											<DeleteListItemButton
												resourceId={artist.resourceId}
												listId={artist.listId}
											/>
										)}
									</div>
								</Reorder.Item>
							))}
						</Reorder.Group>
					)}
					{(listData.category === "ALBUM" ||
						listData.category === "SONG") &&
						listItems?.map((item, index) => {
							return (
								<div
									className={`flex flex-row items-center justify-between pb-2 pt-2 ${
										index !== listItems.length - 1
											? "border-b"
											: ""
									}`}
									key={index}
								>
									<div className="flex w-4/5 flex-row items-center overflow-hidden">
										<p className="w-4 pr-5 text-center text-sm text-muted-foreground">
											{index + 1}
										</p>
										<div className="overflow-hidden">
											<ResourceItem
												resource={{
													parentId: item.parentId!,
													resourceId: item.resourceId,
													category: listData.category,
												}}
											/>
										</div>
									</div>
									{isUser && (
										<DeleteListItemButton
											resourceId={item.resourceId}
											listId={item.listId}
										/>
									)}
								</div>
							);
						})}
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
