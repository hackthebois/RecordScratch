import { api } from "@/trpc/react";
import { SelectComment } from "@/types/comments";
import { SelectLike } from "@/types/likes";
import { ReviewType } from "@/types/rating";
import { timeAgo } from "@/utils/date";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Star } from "lucide-react";
import { Suspense } from "react";
import { ResourceItem } from "../ResourceItem";
import { SignInWrapper } from "../signIn/SignInWrapper";
import { Button, buttonVariants } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { UserAvatar } from "../user/UserAvatar";

const PublicLikeButton = (props: SelectLike) => {
	const [likes] = api.likes.getLikes.useSuspenseQuery(props);

	return (
		<SignInWrapper>
			<Button
				className="gap-2 text-muted-foreground"
				variant="outline"
				size="sm"
			>
				<Heart size={20} />
				<p>{likes}</p>
			</Button>
		</SignInWrapper>
	);
};

const LikeButton = (props: SelectLike) => {
	const utils = api.useUtils();
	const [likes] = api.likes.getLikes.useSuspenseQuery(props);
	const [like] = api.likes.get.useSuspenseQuery(props);

	const { mutate: likeMutation, isPending: isLiking } =
		api.likes.like.useMutation({
			onSettled: async () => {
				await utils.likes.get.invalidate(props);
				await utils.likes.getLikes.invalidate(props);
			},
		});

	const { mutate: unlikeMutation, isPending: isUnLiking } =
		api.likes.unlike.useMutation({
			onSettled: async () => {
				await utils.likes.get.invalidate(props);
				await utils.likes.getLikes.invalidate(props);
			},
		});

	const liked = isLiking ? true : isUnLiking ? false : like;
	const likesCount = isLiking ? likes + 1 : isUnLiking ? likes - 1 : likes;

	return (
		<Button
			className="gap-2 text-muted-foreground"
			variant="outline"
			size="sm"
			onClick={() => {
				if (isLiking || isUnLiking) return;
				if (like) {
					unlikeMutation(props);
				} else {
					likeMutation(props);
				}
			}}
		>
			<Heart
				size={20}
				style={{
					fill: liked ? "#ff4d4f" : "none",
					stroke: liked ? "#ff4d4f" : "currentColor",
				}}
			/>
			<p>{likesCount}</p>
		</Button>
	);
};

const CommentsButton = ({
	handle,
	resourceId,
	authorId,
}: SelectComment & {
	handle: string;
}) => {
	const [comments] = api.comments.getComments.useSuspenseQuery({
		resourceId,
		authorId,
	});

	return (
		<Link
			className={buttonVariants({
				variant: "outline",
				size: "sm",
				className: "gap-2 text-muted-foreground",
			})}
			to="/$handle/ratings/$resourceId"
			params={{
				handle,
				resourceId,
			}}
		>
			<MessageCircle size={20} />
			<p>{comments}</p>
		</Link>
	);
};

export const Review = ({
	userId,
	parentId,
	rating,
	profile,
	content,
	resourceId,
	category,
	updatedAt,
}: ReviewType) => {
	const [profileExists] = api.profiles.me.useSuspenseQuery();
	return (
		<div className="flex flex-col gap-4 rounded-lg border p-3 py-4 text-card-foreground">
			<ResourceItem
				resource={{ parentId, resourceId, category }}
				showType
			/>
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
				<Link
					to="/$handle"
					params={{
						handle: String(profile.handle),
					}}
					className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
				>
					<UserAvatar {...profile} className="h-auto w-8" />
					<p>{profile.name}</p>
					<p className="text-left text-sm text-muted-foreground">
						@{profile.handle} • {timeAgo(updatedAt)}
					</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{content}</p>
				<div className="flex items-center gap-3">
					<Suspense
						fallback={
							<Button
								variant="outline"
								size="sm"
								className="gap-2 text-muted-foreground"
							>
								<Heart size={20} />
								<Skeleton className="h-6 w-8" />
							</Button>
						}
					>
						{profileExists ? (
							<LikeButton
								resourceId={resourceId}
								authorId={userId}
							/>
						) : (
							<PublicLikeButton
								resourceId={resourceId}
								authorId={userId}
							/>
						)}
					</Suspense>
					<Suspense
						fallback={
							<Button
								variant="outline"
								size="sm"
								className="gap-2 text-muted-foreground"
							>
								<MessageCircle size={20} />
								<Skeleton className="h-6 w-8" />
							</Button>
						}
					>
						<CommentsButton
							handle={profile.handle}
							resourceId={resourceId}
							authorId={userId}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
};
