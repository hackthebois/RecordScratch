import { FollowButton } from "@/components/followers/FollowButton";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { UserAvatar } from "@/components/user/UserAvatar";
import { api, apiUtils } from "@/trpc/react";
import { Profile } from "@recordscratch/types";
import { getImageUrl } from "@recordscratch/utils/image";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { BellOff, Heart, User } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/notifications")({
	component: Notifications,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	loader: () => {
		const profile = apiUtils.profiles.me.ensureData();
		if (!profile) notFound();

		apiUtils.notifications.get.ensureData();
	},
});

const FollowNotification = ({ user }: { user: Profile }) => {
	return (
		<Link
			to="/$handle"
			params={{
				handle: user.handle,
			}}
			className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition hover:bg-hover"
		>
			<User size={32} className="text-sky-500" />
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full items-center justify-between">
					<div className="flex gap-3">
						<Link
							to="/$handle"
							params={{
								handle: user.handle,
							}}
						>
							<UserAvatar
								imageUrl={getImageUrl(user)}
								className="h-8 w-8"
							/>
						</Link>
						<p>
							<span className="font-bold">{user.handle}</span>{" "}
							followed you
						</p>
					</div>
					<FollowButton profileId={user.userId} />
				</div>
			</div>
		</Link>
	);
};

const LikeNotification = ({
	user,
	content,
}: {
	user: Profile;
	content?: string | null;
}) => {
	// TODO: link to the review (need review pages first)
	return (
		<div className="flex items-center gap-4 rounded-lg border p-4">
			<Heart size={28} color="#ff4d4f" />
			<div className="flex w-full flex-col gap-2">
				<div className="flex gap-3">
					<Link
						to="/$handle"
						params={{
							handle: user.handle,
						}}
					>
						<UserAvatar
							imageUrl={getImageUrl(user)}
							className="h-8 w-8"
						/>
					</Link>
					<p>
						<span className="font-bold">{user.handle}</span> liked
						your {content ? "review" : "rating"}
					</p>
				</div>
				{content && (
					<p className="text-muted-foreground">
						{content.length > 100
							? content.slice(0, 100) + "..."
							: content}
					</p>
				)}
			</div>
		</div>
	);
};

function Notifications() {
	const [notifications] = api.notifications.get.useSuspenseQuery();

	const { mutate } = api.notifications.markAllSeen.useMutation({
		onSettled: () => {
			apiUtils.notifications.getUnseen.invalidate();
		},
	});

	useEffect(() => {
		mutate();
	}, [mutate]);

	return (
		<div className="flex flex-col gap-3">
			{notifications.length === 0 && (
				<div className="my-[20vh] flex w-full flex-col items-center justify-center gap-6">
					<BellOff size={64} className="text-muted-foreground" />
					<p className="text-muted-foreground">
						No notifications yet
					</p>
				</div>
			)}
			{notifications.map((notification) => (
				<div key={notification.id}>
					{notification.type === "FOLLOW" && (
						<FollowNotification user={notification.from} />
					)}
					{notification.type === "LIKE" && (
						<LikeNotification
							user={notification.from}
							content={notification.rating?.content}
						/>
					)}
				</div>
			))}
		</div>
	);
}
