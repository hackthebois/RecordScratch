import { PendingComponent } from "@/components/router/Pending";
import {
	ErrorComponent,
	Link,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { api } from "@/trpc/react";
import { Head } from "@/components/Head";
import { NotFound } from "@/components/ui/NotFound";
import Metadata from "@/components/Metadata";
import { UserAvatar } from "@/components/UserAvatar";
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
});

function List() {
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list" } = Route.useSearch();
	const { listId } = Route.useParams();

	const { data: myProfile } = api.profiles.me.useQuery();
	const { data: listData, isLoading } = api.lists.getList.useQuery({
		id: listId,
	});
	const { data: listItems } = api.lists.resources.getListResources.useQuery({
		listId: listId,
	});

	if (isLoading) return <PendingComponent />;
	if (!listData) return <NotFound />;

	const { profile } = listData;
	const isUser = myProfile?.userId === profile.userId;

	const ListCategory =
		listData.category === "ALBUM"
			? "ALBUM LIST"
			: listData.category === "SONG"
				? "SONG LIST"
				: listData.category === "ARTIST"
					? "ARTIST LIST"
					: "";

	return (
		<div className="flex flex-col gap-6">
			<Head title={listData.name} description={undefined} />
			<Metadata
				title={listData.name}
				tags={[]}
				type={ListCategory}
				ownImage={true}
				Image={
					<ListImage
						listItems={listItems}
						category={listData.category}
						size={200}
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
					<p className="flex">{profile.name}</p>
				</Link>
				<h5>{listData.description}</h5>
			</Metadata>
			<Tabs value={tab}>
				<div className="flex flex-row">
					<TabsList className=" space-x-2">
						<TabsTrigger
							value="list"
							onClick={() =>
								navigate({
									search: {
										tab: undefined,
									},
								})
							}
						>
							List
						</TabsTrigger>
						{isUser && (
							<TabsTrigger
								value="settings"
								onClick={() =>
									navigate({
										search: {
											tab: "settings",
										},
									})
								}
							>
								Settings
							</TabsTrigger>
						)}
					</TabsList>
				</div>
				<TabsContent value="list">
					{isUser && (
						<SearchAddToList
							category={listData.category}
							listId={listData.id}
						/>
					)}
					{listData.category === "ARTIST" &&
						listItems?.map((artist, index) => (
							<div
								className="my-3 flex flex-row items-center justify-between border-b pb-1"
								key={index}
							>
								<div
									className="flex flex-row items-center"
									key={index}
								>
									<p className=" w-4 pr-5 text-center text-sm text-muted-foreground">
										{index + 1}
									</p>
									<ArtistItem artistId={artist.resourceId} />
								</div>
								<DeleteListItemButton
									resourceId={artist.resourceId}
									listId={artist.listId}
								/>
							</div>
						))}
					{(listData.category === "ALBUM" ||
						listData.category === "SONG") &&
						listItems?.map((item, index) => {
							return (
								<div
									className="my-3 flex flex-row items-center justify-between border-b pb-1"
									key={index}
								>
									<div className="flex flex-row items-center">
										<p className="w-4 pr-5 text-center text-sm text-muted-foreground">
											{index + 1}
										</p>
										<ResourceItem
											resource={{
												parentId: item.parentId!,
												resourceId: item.resourceId,
												category: listData.category,
											}}
										/>
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
								<DeleteListButton
									userId={myProfile?.userId}
									listId={listData.id}
									onClick={async () =>
										await navigate({
											to: `/${profile.handle}`,
											search: {
												tab: "lists",
											},
										})
									}
								/>
							</div>
						</div>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
