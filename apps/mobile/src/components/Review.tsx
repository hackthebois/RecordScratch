import { api } from "@/utils/api";
import { ReviewType, SelectComment, SelectLike } from "@recordscratch/types";
import { View } from "react-native";
import { ResourceItem } from "./ResourceItem";
import { Star, MessageCircle, Heart, Reply } from "lucide-react-native";
import { getImageUrl } from "@/utils/image";
import { timeAgo } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Suspense } from "react";
import { Button, buttonVariants } from "./Button";
import { UserAvatar } from "./UserAvatar";

const PublicLikeButton = (props: SelectLike) => {
	const [likes] = api.likes.getLikes.useSuspenseQuery(props);

	return (
		<Button variant="secondary" size="sm" label="">
			<View className="flex flex-row gap-2 text-muted-foreground">
				<Heart size={20} />
				<p>{likes}</p>
			</View>
		</Button>
	);
};

const ReplyButton = ({
	handle,
	resourceId,
	onClick,
}: {
	resourceId: string;
	handle: string;
	onClick: () => void;
}) => {
	return (
		<Link
			className={buttonVariants({
				variant: "secondary",
				size: "sm",
				className: "gap-2 text-muted-foreground",
			})}
			href={{
				pathname: "profiles/[handle]/ratings/[id]",
				params: {
					handle,
					id: resourceId,
				},
			}}
			onPress={onClick}
		>
			<Reply size={20} />
		</Link>
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
				variant: "secondary",
				size: "sm",
				className: "gap-2 text-muted-foreground",
			})}
			href={{
				pathname: "profiles/[handle]/ratings/[id]",
				params: { handle: handle, id: resourceId },
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
	onReply,
}: ReviewType & { onReply?: () => void }) => {
	const [profileExists] = api.profiles.me.useSuspenseQuery();
	return (
		<View className="flex flex-col gap-4 rounded-lg border p-3 py-4 text-card-foreground">
			<ResourceItem
				resource={{ parentId, resourceId, category }}
				showType
				imageCss="h-16 w-16"
			/>
			<View className="flex flex-1 flex-col items-start gap-3">
				<View className="flex flex-row items-center gap-1">
					{Array.from(Array(rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" fill="#ffb703" />
					))}
					{Array.from(Array(10 - rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</View>
				<Link
					href={`/profiles/${String(profile.handle)}`}
					className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
				>
					<UserAvatar size={50} imageUrl={getImageUrl(profile)} />
					<p>{profile.name}</p>
					<p className="text-left text-sm text-muted-foreground">
						@{profile.handle} • {timeAgo(updatedAt)}
					</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{content}</p>
				<View className="flex flex-row items-center gap-3">
					<Suspense
						fallback={
							<Button
								variant="default"
								size="sm"
								className="gap-2 text-muted-foreground"
								label={""}
							>
								<Heart size={20} />
								{/* <Skeleton className="h-6 w-8" /> */}
							</Button>
						}
					>
						{/* {profileExists ? (
							<LikeButton resourceId={resourceId} authorId={userId} />
						) : */}
						<PublicLikeButton resourceId={resourceId} authorId={userId} />
					</Suspense>
					<Suspense
						fallback={
							<Button
								variant="secondary"
								size="sm"
								className="gap-2 text-muted-foreground"
								label={""}
							>
								<MessageCircle size={20} />
								{/* <Skeleton className="h-6 w-8" /> */}
							</Button>
						}
					>
						<CommentsButton
							handle={profile.handle}
							resourceId={resourceId}
							authorId={userId}
						/>
					</Suspense>
					<ReplyButton
						handle={profile.handle}
						resourceId={resourceId}
						onClick={() => {
							if (onReply) onReply();
						}}
					/>
				</View>
			</View>
		</View>
	);
};
