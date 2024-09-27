import NotFoundScreen from "#/app/+not-found";
import { CommentAndProfile, CommentAndProfileAndParent, Profile } from "@recordscratch/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Review } from "~/components/Review";
import { Comment } from "~/components/Comments/Comment";
import { api } from "~/lib/api";
import { CommentForm } from "~/components/Comments/CommentForm";

const CommentLayout = ({
	comment,
	myProfile,
	openCommentFormId,
	toggleCommentForm,
}: {
	comment: CommentAndProfile;
	myProfile: Profile | null;
	openCommentFormId: string | null;
	toggleCommentForm: (_commentId: string | null) => void;
}) => {
	const [replies, setReplies] = useState<CommentAndProfileAndParent[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const { data: getReplies } = api.comments.getReplies.useQuery({
		rootId: comment.id,
		authorId: comment.authorId,
		resourceId: comment.resourceId,
	});

	const [replyCount] = api.comments.getReplyCount.useSuspenseQuery({
		rootId: comment.id,
		authorId: comment.authorId,
		resourceId: comment.resourceId,
	});

	useEffect(() => {
		if (getReplies) {
			setReplies(getReplies);
		}
	}, [getReplies]);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<View>
			<Comment
				{...comment}
				replyCount={replyCount}
				myProfile={myProfile}
				commentView={toggleOpen}
				openCommentFormId={openCommentFormId}
				toggleCommentForm={toggleCommentForm}
			/>
			<View>
				{isOpen &&
					replies.map((reply) => {
						return (
							<View className=" flex ml-5 mt-1 flex-1" key={reply.id}>
								<Comment
									{...reply}
									myProfile={myProfile}
									parentProfile={reply.parent}
									openCommentFormId={openCommentFormId}
									toggleCommentForm={toggleCommentForm}
								/>
							</View>
						);
					})}
			</View>
		</View>
	);
};

const RatingPage = () => {
	const { id, handle } = useLocalSearchParams<{ id: string; handle: string }>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle!);

	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [rating] = api.ratings.user.get.useSuspenseQuery({
		userId: profile!.userId,
		resourceId: id!,
	});
	const [comments] = api.comments.list.useSuspenseQuery({
		resourceId: id!,
		authorId: profile!.userId,
	});

	const [openReply, setOpenReply] = useState(false);
	const toggleOpenReply = () => {
		setOpenReply((open: boolean) => {
			if (!open) toggleCommentForm(null);
			return !open;
		});
	};

	const [openCommentFormId, setOpenCommentFormId] = useState<string | null>(null);
	const toggleCommentForm = (commentId: string | null) => {
		if (commentId === openCommentFormId) setOpenCommentFormId(null);
		else setOpenCommentFormId(commentId);

		if (commentId) setOpenReply(false);
	};

	if (!profile || !rating) return <NotFoundScreen />;

	return (
		<ScrollView className="flex flex-col pb-40 px-1">
			<Stack.Screen options={{ headerTitle: `${profile.name}'s Rating` }} />
			<View className="my-1">
				<Review {...rating} profile={profile} onReply={toggleOpenReply} />
			</View>
			{openReply && myProfile && (
				<CommentForm
					profile={myProfile}
					authorId={profile.userId}
					onSubmitForm={toggleOpenReply}
				/>
			)}
			{comments.map((comment: CommentAndProfile) => (
				<CommentLayout
					comment={comment}
					myProfile={myProfile}
					key={comment.id}
					openCommentFormId={openCommentFormId}
					toggleCommentForm={toggleCommentForm}
				/>
			))}
		</ScrollView>
	);
};
export default RatingPage;
