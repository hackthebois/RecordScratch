import { FollowButton } from "@/components/followers/FollowButton";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getImageUrl } from "@/lib/image";
import { api, apiUtils } from "@/trpc/react";
import {
	CommentAndProfile,
	CommentSchemaType,
	Profile,
	Rating,
} from "@recordscratch/types";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { BellOff, Heart, MessageCircle, User } from "lucide-react";
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
	rating,
	content,
}: {
	user: Profile;
	rating: Rating;
	content?: string | null;
}) => {
	// TODO: link to the review (need review pages first)
	return (
		<Link
			className="flex items-center gap-4 rounded-lg border p-4"
			to="/$handle/ratings/$resourceId"
			params={{ handle: user.handle, resourceId: rating.resourceId }}
		>
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
		</Link>
	);
};
const CommentNotification = ({
	user,
	comment,
	type,
	ratingProfile,
}: {
	user: Profile;
	comment: CommentSchemaType;
	type: "REPLY" | "COMMENT";
	ratingProfile: Profile;
}) => {
	const content = comment.content;
	return (
		<Link
			className="flex items-center gap-4 rounded-lg border p-4"
			to="/$handle/ratings/$resourceId"
			params={{
				handle: ratingProfile.handle,
				resourceId: comment.resourceId,
			}}
		>
			<MessageCircle size={28} />
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
					{type === "COMMENT" ? (
						<p>
							<span className="font-bold">{user.handle}</span>{" "}
							commented on your {content ? "review" : "rating"}
						</p>
					) : (
						<p>
							<span className="font-bold">{user.handle}</span>{" "}
							replied to your comment {content}
						</p>
					)}
				</div>
				{content && (
					<p className="text-muted-foreground">
						{content.length > 100
							? content.slice(0, 100) + "..."
							: content}
					</p>
				)}
			</div>
		</Link>
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

	const emptyNotifications =
		notifications.comments.length === 0 &&
		notifications.follows.length === 0 &&
		notifications.likes.length === 0;

	return (
		<div className="flex flex-col gap-3">
			{emptyNotifications && (
				<div className="my-[20vh] flex w-full flex-col items-center justify-center gap-6">
					<BellOff size={64} className="text-muted-foreground" />
					<p className="text-muted-foreground">
						No notifications yet
					</p>
				</div>
			)}
			{/* {notifications.map((notification) => (
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
					{notification.type === "REPLY" && (
						<ReplyNotification user={notification.from} />
					)}
					{notification.type === "COMMENT" && (
						<CommentNotification
							user={notification.from}
							content={notification.rating?.content}
						/>
					)}
				</div>
			))} */}

			{notifications.comments.map((notification) => (
				<div key={notification.notification.id}>
					<CommentNotification
						user={notification.profile}
						comment={notification.comment}
						ratingProfile={notification.ratingProfile}
						type={notification.notification.type}
					/>
				</div>
			))}
			{notifications.follows.map((notification, index) => (
				<div key={index}>
					<FollowNotification user={notification.profile} />
				</div>
			))}
			{notifications.likes.map((notification, index) => (
				<div key={index}>
					<LikeNotification
						user={notification.profile}
						content={notification.ratings.content}
						rating={notification.ratings}
					/>
				</div>
			))}
		</div>
	);
}
