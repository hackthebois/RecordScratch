import { getImageUrl } from "~/lib/image";
import { timeAgo } from "@recordscratch/lib";
import { Profile } from "@recordscratch/types";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/lib/api";
import { CommentMenu } from "./CommentMenu";
import { CommentForm } from "./CommentForm";
import { AtSign } from "~/lib/icons/AtSign";
import { Reply } from "~/lib/icons/Reply";
import { MessageCircle } from "~/lib/icons/MessageCircle";

export const Comment = ({
	id,
	rootId,
	resourceId,
	authorId,
	content,
	replyCount,
	updatedAt,
	profile,
	myProfile,
	parentProfile,
	commentView,
	openCommentFormId,
	toggleCommentForm,
}: {
	id: string;
	rootId: string | null;
	authorId: string;
	resourceId: string;
	content: string;
	replyCount?: number;
	updatedAt: Date;
	profile: Profile;
	myProfile: Profile | null;
	parentProfile?: Profile;
	commentView?: () => void;
	openCommentFormId: string | null;
	toggleCommentForm: (_commentId: string | null) => void;
}) => {
	const utils = api.useUtils();
	const { mutate: deleteComment } = api.comments.delete.useMutation({
		onSettled: () => {
			if (!rootId)
				utils.comments.list.invalidate({
					authorId,
					resourceId,
				});
			else {
				utils.comments.getReplies.invalidate({
					authorId,
					resourceId,
					rootId,
				});
				utils.comments.getReplyCount.invalidate({
					authorId,
					resourceId,
					rootId,
				});
			}
			utils.comments.getComments.invalidate({
				authorId,
				resourceId,
			});
		},
	});

	return (
		<>
			<View className="flex flex-col gap-3 rounded border-gray-300 border p-3">
				<View className="flex flex-row justify-between">
					<Link href={`/${String(profile.handle)}`}>
						<View className="flex flex-row flex-wrap items-center gap-2">
							<UserAvatar size={40} imageUrl={getImageUrl(profile)} />
							<Text className="text-lg">{profile.name}</Text>
							<Text className="text-left text-muted-foreground text-lg">
								@{profile.handle} • {timeAgo(updatedAt)}
							</Text>
						</View>
					</Link>
					{myProfile?.userId == profile.userId && (
						<CommentMenu onPress={() => deleteComment({ id })} />
					)}
				</View>
				<View className="flex flex-row items-center">
					{!!parentProfile && (
						<View className=" mr-2 flex flex-row items-center rounded">
							<AtSign size={15} color="black" />
							<Text className=" max-w-20 truncate">{parentProfile.handle}</Text>
						</View>
					)}
					{!!content && (
						<Text className="whitespace-pre-line text-lg min-h-7">{content}</Text>
					)}
				</View>
				<View className="flex flex-row gap-2">
					{!!replyCount && (
						<Button
							variant="secondary"
							size="sm"
							className=" w-16 gap-2 text-muted-foreground flex flex-row"
							onPress={commentView}
						>
							<MessageCircle size={20} color="black" />
							<Text>{replyCount}</Text>
						</Button>
					)}
					{myProfile && (
						<Button
							variant="secondary"
							size="sm"
							className=" w-12 gap-2 text-black"
							onPress={() => {
								toggleCommentForm(id);
							}}
						>
							<Reply size={20} color="black" />
						</Button>
					)}
				</View>
			</View>
			{openCommentFormId === id && myProfile && (
				<View className={!rootId ? "ml-10 mt-2" : ""}>
					<CommentForm
						replyHandle={profile.handle}
						profile={myProfile}
						authorId={authorId}
						rootId={rootId ?? id}
						parentId={id}
						onSubmitForm={() => {
							toggleCommentForm(null);
						}}
						replyUserId={profile.userId}
					/>
				</View>
			)}
		</>
	);
};
