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
import AlbumList from "@/components/album/AlbumList";
import { ResourceItem } from "@/components/ResourceItem";
import { Button } from "@/components/ui/Button";
import SearchBar from "@/components/SearchBar";
import ListItemAdd from "@/components/lists/ListItemAdd";
import { ArtistItem } from "@/components/artist/ArtistItem";

export const Route = createFileRoute("/_app/lists/$listId/")({
	component: List,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				tab: z.enum(["list"]).optional(),
			})
			.parse(search);
	},
});

const undefinedImage =
	"https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg";

function List() {
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list" } = Route.useSearch();
	const { listId } = Route.useParams();

	const { data: listData, isLoading } = api.lists.getList.useQuery({
		id: listId,
	});
	const { data: listItems } = api.lists.resources.getListResources.useQuery({
		listId: listId,
	});

	if (isLoading) return <PendingComponent />;
	if (!listData) return <NotFound />;

	const { profile } = listData;

	return (
		<div className="flex flex-col gap-6">
			<Head title={listData.name} description={undefined} />
			<Metadata
				title={listData.name}
				cover={undefinedImage}
				tags={[]}
				type={listData.category}
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
					<TabsList>
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
					</TabsList>
					<div className="pl-3">
						<ListItemAdd category={listData.category} />
					</div>
				</div>
				<TabsContent value="list">
					{listData.category === "ARTIST" &&
						listItems?.map((artist, index) => (
							<div className=" my-3 flex flex-row items-center">
								<p className=" w-4 pr-5 text-center text-sm text-muted-foreground">
									{index + 1}
								</p>
								<ArtistItem
									artistId={artist.resourceId}
									key={index}
								/>
							</div>
						))}
					{(listData.category === "ALBUM" ||
						listData.category === "SONG") &&
						listItems?.map((item, index) => {
							return (
								<div className=" my-3 flex flex-row items-center">
									<p className=" w-4 pr-5 text-center text-sm text-muted-foreground">
										{index + 1}
									</p>
									<ResourceItem
										resource={{
											parentId: "",
											resourceId: item.resourceId,
											category: listData.category,
										}}
										key={index}
									/>
								</div>
							);
						})}
				</TabsContent>
			</Tabs>
		</div>
	);
}
