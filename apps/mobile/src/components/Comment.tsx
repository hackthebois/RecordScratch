import { api } from "@/utils/api";
import { Profile } from "@recordscratch/types";
import { UserAvatar } from "./UserAvatar";
import { timeAgo } from "@recordscratch/lib";
import { AtSign, MessageCircle, Reply } from "lucide-react-native";
import { Text } from "./Text";
import { Button } from "./Button";
import { Link } from "expo-router";
import { getImageUrl } from "@/utils/image";

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
			<div className="relative flex flex-col gap-3 rounded border p-3">
				<div className="flex flex-row justify-between">
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
						<p>{profile.name}</p>
						<p className="text-left text-sm text-muted-foreground">
							@{profile.handle} • {timeAgo(updatedAt)}
						</p>
					</Link>
					{/* {myProfile?.userId == profile.userId && (
						<CommentMenu onClick={() => deleteComment({ id })} />
					)} */}
				</div>
				<div className="flex flex-row items-center">
					{!!parentProfile && (
						<Text variant="h3" className=" mr-2 flex flex-row items-center rounded">
							<AtSign size={15} />
							<p className=" max-w-20 truncate">{parentProfile.handle}</p>
						</Text>
					)}
					<p className="text-sm">{content}</p>
				</div>
				<div className="flex flex-row gap-2">
					{!!replyCount && (
						<Button
							variant="secondary"
							size="sm"
							className=" w-16 gap-2 text-muted-foreground"
							onPress={commentView}
							label=""
						>
							<MessageCircle size={20} />
							<p>{replyCount}</p>
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
				</div>
			</div>
			{openCommentFormId === id && myProfile && (
				<div className={!rootId ? "ml-10 mt-2" : ""}>
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
				</div>
			)}
		</>
	);
};
export default Comment;
