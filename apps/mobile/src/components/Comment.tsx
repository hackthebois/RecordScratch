import { getImageUrl } from "@/utils/image";
import { timeAgo } from "@recordscratch/lib";
import { Profile } from "@recordscratch/types";
import { Link } from "expo-router";
import { AtSign, MessageCircle, Reply } from "lucide-react-native";
import { Button } from "./Button";
import { View } from "react-native";
import { Text } from "./Text";
import { UserAvatar } from "./UserAvatar";

const Comment = ({
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
	// eslint-disable-next-line no-unused-vars
	toggleCommentForm: (commentId: string | null) => void;
}) => {
	// const utils = api.useUtils();
	// const { mutate: deleteComment } = api.comments.delete.useMutation({
	// 	onSettled: () => {
	// 		if (!rootId)
	// 			utils.comments.list.invalidate({
	// 				authorId,
	// 				resourceId,
	// 			});
	// 		else {
	// 			utils.comments.getReplies.invalidate({
	// 				authorId,
	// 				resourceId,
	// 				rootId,
	// 			});
	// 			utils.comments.getReplyCount.invalidate({
	// 				authorId,
	// 				resourceId,
	// 				rootId,
	// 			});
	// 		}
	// 		utils.comments.getComments.invalidate({
	// 			authorId,
	// 			resourceId,
	// 		});
	// 	},
	// });

	return (
		<>
			<View className="relative flex flex-col gap-3 rounded border-gray-300 border p-3">
				<View className="flex flex-row justify-between">
					<Link
						href={{
							pathname: "profile/[handle]",
							params: {
								handle: profile.handle,
							},
						}}
						className="flex min-w-0 max-w-60 flex-1 flex-wrap items-center gap-2"
					>
						<UserAvatar size={50} imageUrl={getImageUrl(profile)} />
						<Text>{profile.name}</Text>
						<Text className="text-left text-sm text-muted-foreground">
							<Text>{profile.name}</Text>
							<Text className="text-left text-sm text-muted-foreground">
								@{profile.handle} • {timeAgo(updatedAt)}
							</Text>
						</Text>
					</Link>
					{/* {myProfile?.userId == profile.userId && (
						<CommentMenu onClick={() => deleteComment({ id })} />
					)} */}
				</View>
				<View className="flex flex-row items-center">
					{!!parentProfile && (
						<Text variant="h3" className=" mr-2 flex flex-row items-center rounded">
							<AtSign size={15} />
							<Text className=" max-w-20 truncate">{parentProfile.handle}</Text>
							<Text className=" max-w-20 truncate">{parentProfile.handle}</Text>
						</Text>
					)}
					<Text className="text-sm">{content}</Text>
				</View>
				<View className="flex flex-row gap-2">
					{!!replyCount && (
						<Button
							variant="secondary"
							size="sm"
							className=" w-16 gap-2 text-muted-foreground"
							onPress={commentView}
							label=""
						>
							<MessageCircle size={20} />
							<Text>{replyCount}</Text>
							<Text>{replyCount}</Text>
						</Button>
					)}
					{myProfile && (
						<Button
							variant="secondary"
							label=""
							size="sm"
							className=" w-12 gap-2 text-muted-foreground"
							// onClick={() => {
							// 	toggleCommentForm(id);
							// }}
						>
							<Reply size={20} />
						</Button>
					)}
				</View>
			</View>
			{openCommentFormId === id && myProfile && (
				<View className={!rootId ? "ml-10 mt-2" : ""}>
					{/* <CommentForm
						replyHandle={profile.handle}
						profile={myProfile}
						authorId={authorId}
						rootId={rootId ?? id}
						parentId={id}
						onSubmitForm={() => {
							toggleCommentForm(null);
						}}
						replyUserId={profile.userId}
					/> */}
				</View>
			)}
		</>
	);
};
export default Comment;
