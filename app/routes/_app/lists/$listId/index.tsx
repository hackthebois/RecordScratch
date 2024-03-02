import { PendingComponent } from "@/components/router/Pending";
import { ErrorComponent, Link, createFileRoute } from "@tanstack/react-router";
import { api } from "@/trpc/react";
import { Head } from "@/components/Head";
import { NotFound } from "@/components/ui/NotFound";
import Metadata from "@/components/Metadata";
import { UserAvatar } from "@/components/UserAvatar";

export const Route = createFileRoute("/_app/lists/$listId/")({
	component: List,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

const undefinedImage =
	"https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg";

function List() {
	const { listId } = Route.useParams();

	const { data: listData, isLoading } = api.lists.getList.useQuery({
		id: listId,
	});

	if (isLoading) return <PendingComponent />;
	if (!listData) return <NotFound />;

	const { profile } = listData;

	return (
		<div className="flex flex-col gap-6">
			<Head
				title={listData.name}
				description={listData.description ?? ""}
			/>
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
		</div>
	);
}
