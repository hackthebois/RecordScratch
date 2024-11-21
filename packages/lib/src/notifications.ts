import type { Comment, Profile, Rating } from "@recordscratch/types";

export type Notification = {
	title: string;
	action: string;
	body: string;
	profile: Profile;
	content: string | undefined;
	data: { url: string };
};

export const parseCommentNotification = ({
	profile,
	comment,
}: {
	profile: Profile;
	comment: Comment;
}): Notification => {
	const type = comment.parentId ? "REPLY" : "COMMENT";
	const action = type === "REPLY" ? "replied" : "commented";
	return {
		title: `New ${type === "REPLY" ? "Reply" : "Comment"}!`,
		profile,
		action,
		body: `${profile.name} ${action}: ${comment.content}`,
		content: comment.content,
		data: {
			url: `/${profile.handle}/ratings/${comment.resourceId}`,
		},
	};
};

export const parseFollowNotification = ({ profile }: { profile: Profile }): Notification => {
	return {
		title: "New Follower!",
		action: "followed you",
		body: `${profile.name} followed you`,
		content: undefined,
		profile,
		data: {
			url: `/${profile.handle}`,
		},
	};
};

export const parseLikeNotification = ({
	profile,
	rating,
	handle,
}: {
	profile: Profile;
	rating: Rating;
	handle: string;
}): Notification => {
	const action = rating.content ? "liked your review" : "liked your rating";
	return {
		title: "New Like!",
		action,
		body: `${profile.name} ${action}${rating.content ? `: ${rating.content}` : ""}`,
		content: rating.content ?? undefined,
		profile,
		data: {
			url: `/${handle}/ratings/${rating.resourceId}`,
		},
	};
};
