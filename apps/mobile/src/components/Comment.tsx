import { UserAvatar } from "@/components/UserAvatar";
import { Text } from "@/components/ui/text";
import { RouterOutputs, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Heart, MessageCircle } from "@/lib/icons/IconsLoader";
import { cn } from "@recordscratch/lib";
import { Reply } from "@/lib/icons/IconsLoader";
import { Trash } from "@/lib/icons/IconsLoader";
import { getImageUrl } from "@/lib/image";
import { timeAgo } from "@recordscratch/lib";
import { Link, useRouter } from "expo-router";
import { Suspense } from "react";
import { Pressable, View } from "react-native";
import { Button } from "./ui/button";

const LikeButton = (props: { commentId: string }) => {
	const utils = api.useUtils();
	const [likes] = api.comments.likes.getLikes.useSuspenseQuery(props);
	const [like] = api.comments.likes.get.useSuspenseQuery(props);

	const { mutate: likeMutation, isPending: isLiking } =
		api.comments.likes.like.useMutation({
			onSettled: async () => {
				await utils.comments.likes.get.invalidate(props);
				await utils.comments.likes.getLikes.invalidate(props);
			},
		});

	const { mutate: unlikeMutation, isPending: isUnLiking } =
		api.comments.likes.unlike.useMutation({
			onSettled: async () => {
				await utils.comments.likes.get.invalidate(props);
				await utils.comments.likes.getLikes.invalidate(props);
			},
		});

	const liked = isLiking ? true : isUnLiking ? false : like;
	const likesCount = isLiking ? likes + 1 : isUnLiking ? likes - 1 : likes;

	return (
		<Button
			variant="ghost"
			size={"sm"}
			onPress={() => {
				if (isLiking || isUnLiking) return;
				if (like) {
					unlikeMutation(props);
				} else {
					likeMutation(props);
				}
			}}
			className="flex-row gap-2"
		>
			<Heart
				size={25}
				className={cn(
					liked
						? "fill-red-500 stroke-red-500"
						: "stroke-muted-foreground fill-background",
				)}
			/>
			<Text className="font-bold">{likesCount}</Text>
		</Button>
	);
};

const CommentButton = ({ id }: { id: string }) => {
	const [comments] = api.comments.count.reply.useSuspenseQuery({
		id,
	});

	return (
		<Link
			href={{
				pathname: "/comments/[id]",
				params: { id },
			}}
			asChild
		>
			<Button variant="ghost" size={"sm"} className="flex-row gap-2">
				<MessageCircle size={25} className="text-muted-foreground" />
				<Text className="font-bold">{comments}</Text>
			</Button>
		</Link>
	);
};

export const Comment = ({
	comment: { id, rootId, content, profile, updatedAt, resourceId, authorId },
	hideActions,
}: {
	comment: RouterOutputs["comments"]["list"][0];
	hideActions?: boolean;
}) => {
	const router = useRouter();
	const myProfile = useAuth((s) => s.profile);
	const utils = api.useUtils();

	const { mutate: deleteComment } = api.comments.delete.useMutation({
		onSuccess: () => {
			if (!rootId) {
				router.back();
			}
		},
		onSettled: async () => {
			if (rootId) {
				await utils.comments.get.invalidate({ id: rootId });
				await utils.comments.count.reply.invalidate({ id: rootId });
			} else {
				await utils.comments.list.invalidate({ resourceId });
				await utils.comments.count.rating.invalidate({
					resourceId,
					authorId,
				});
			}
		},
	});

	return (
		<View className="gap-4 p-4">
			<Link href={`/${String(profile.handle)}`} asChild>
				<Pressable className="flex flex-row flex-wrap items-center gap-2">
					<UserAvatar imageUrl={getImageUrl(profile)} />
					<Text className="text-lg">{profile.name}</Text>
					<Text className="text-muted-foreground text-left text-lg">
						@{profile.handle} • {timeAgo(updatedAt)}
					</Text>
				</Pressable>
			</Link>
			<Text className="text-lg">{content}</Text>
			{!hideActions ? (
				<View className="flex flex-row items-center">
					<LikeButton commentId={id} />
					{!rootId ? (
						<>
							<Suspense>
								<CommentButton id={id} />
							</Suspense>
							<Link
								href={{
									pathname: "/(modals)/reply/comment",
									params: { id },
								}}
								asChild
							>
								<Button variant="ghost" size={"sm"}>
									<Reply
										size={25}
										className="text-muted-foreground"
									/>
								</Button>
							</Link>
						</>
					) : null}
					{myProfile?.userId === profile.userId ? (
						<Button
							variant="ghost"
							size={"sm"}
							onPress={() => deleteComment({ id })}
						>
							<Trash
								size={20}
								className="text-muted-foreground"
							/>
						</Button>
					) : null}
				</View>
			) : null}
		</View>
	);
};
