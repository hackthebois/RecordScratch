import { ResourceItem } from "@/components/ResourceItem";
import { FollowButton } from "@/components/followers/FollowButton";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getImageUrl } from "@/lib/image";
import { api, apiUtils } from "@/trpc/react";
import {
	CommentSchemaType,
	Profile,
	Rating,
	ReviewType,
} from "@recordscratch/types";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { BellOff, Heart, MessageCircle, Star, User } from "lucide-react";
import React, { useEffect } from "react";

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
			<div className="mr-4 flex w-full flex-col gap-2">
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-3">
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
						<p className="text-sm lg:text-base">
							<span className="font-bold">{user.handle}</span>{" "}
							followed you
						</p>
					</div>
					<div className="hidden lg:block">
						<FollowButton profileId={user.userId} />
					</div>
				</div>
			</div>
		</Link>
	);
};

const Review = ({ parentId, rating, resourceId, category }: ReviewType) => {
	return (
		<div>
			<div className=" mb-2 max-w-52 truncate">
				<ResourceItem
					resource={{ parentId, resourceId, category }}
					showType
				/>
			</div>
			<div className="flex flex-1 flex-col items-start gap-3">
				<div className="flex items-center gap-1">
					{Array.from(Array(rating)).map((_, i) => (
						<Star
							key={i}
							size={18}
							color="#ffb703"
							fill="#ffb703"
						/>
					))}
					{Array.from(Array(10 - rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</div>
			</div>
		</div>
	);
};

const LikeNotification = ({
	fromUser,
	user,
	rating,
}: {
	fromUser: Profile;
	user: Profile;
	rating: Rating;
}) => {
	// TODO: link to the review (need review pages first)
	return (
		<Link
			className="flex items-center gap-4 rounded-lg border p-4"
			to="/$handle/ratings/$resourceId"
			params={{ handle: user.handle, resourceId: rating.resourceId }}
		>
			<Heart size={28} color="#ff4d4f" />
			<div className="mr-10 flex w-full flex-row items-center justify-end">
				<div className="flex w-full flex-col gap-2">
					<div className="flex items-center gap-3">
						<Link
							to="/$handle"
							params={{
								handle: fromUser.handle,
							}}
						>
							<UserAvatar
								imageUrl={getImageUrl(fromUser)}
								className="h-8 w-8"
							/>
						</Link>
						<p className="text-sm lg:text-base">
							<span className="font-bold">{fromUser.handle}</span>{" "}
							liked your {rating.content ? "review" : "rating"}
						</p>
					</div>
				</div>
				<div className="hidden lg:block">
					<Review {...rating} profile={user} />
				</div>
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
			<div className="mr-10 flex w-full flex-row items-center justify-end">
				<div className="flex w-full flex-row items-center gap-2">
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
						<p className="text-sm lg:text-base">
							<span className="font-bold">{user.handle}</span>{" "}
							commented on your {!content ? "review" : "rating"}
						</p>
					) : (
						<p className="text-sm lg:text-base">
							<span className="font-bold">{user.handle}</span>{" "}
							replied to your comment
						</p>
					)}
				</div>
				<p className="hidden w-96 text-end text-muted-foreground lg:block">
					"
					{content.length > 100
						? content.slice(0, 100) + "..."
						: content}
					"
				</p>
			</div>
		</Link>
	);
};

function Notifications() {
	const [allNotifications] = api.notifications.get.useSuspenseQuery();
	const [userProfile] = api.profiles.me.useSuspenseQuery();

	const { mutate } = api.notifications.markAllSeen.useMutation({
		onSettled: () => {
			apiUtils.notifications.getUnseen.invalidate();
		},
	});

	useEffect(() => {
		mutate();
	}, [mutate]);

	const emptyNotifications = allNotifications.length === 0;

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
			{allNotifications.map((notification, index) => (
				<React.Fragment key={index}>
					{notification.notifType === "COMMENT" && (
						<CommentNotification
							user={notification.profile}
							/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
							/* @ts-ignore */
							comment={notification.comment}
							/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
							/* @ts-ignore */
							ratingProfile={notification.ratingProfile}
							/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
							/* @ts-ignore */
							type={notification.notification.type}
						/>
					)}
					{notification.notifType === "FOLLOW" && (
						<FollowNotification user={notification.profile} />
					)}

					{notification.notifType === "LIKE" && (
						<LikeNotification
							user={userProfile!}
							fromUser={notification.profile}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							/* @ts-ignore */
							content={notification.ratings.content}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							/* @ts-ignore */
							rating={notification.ratings}
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
