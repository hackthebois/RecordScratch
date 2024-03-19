import { api } from "@/trpc/react";
import { Review as ReviewType } from "@/types/rating";
import { timeAgo } from "@/utils/date";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { Suspense } from "react";
import { ResourceItem } from "./ResourceItem";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/Skeleton";

const Likes = (props: { resourceId: string; authorId: string }) => {
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
	return (
		<div className="mb-3 flex flex-col gap-4 rounded-lg border p-3 py-4 text-card-foreground">
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
					<UserAvatar {...profile} size={30} />
					<p>{profile.name}</p>
					<p className="text-left text-sm text-muted-foreground">
						@{profile.handle} • {timeAgo(updatedAt)}
					</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{content}</p>
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
					<Likes resourceId={resourceId} authorId={userId} />
				</Suspense>
			</div>
		</div>
	);
};
