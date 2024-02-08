"use client";

import { followUser, unFollowUser } from "@/app/_api/actions";
import { Button } from "./ui/Button";

export const FollowButton = ({
	isFollowing,
	show,
	profileId,
}: {
	isFollowing: boolean;
	show: boolean;
	profileId: string;
}) => {
	if (!show) return null;

	return (
		<>
			{isFollowing ? (
				<Button
					variant="secondary"
					onClick={() => unFollowUser(profileId)}
				>
					Unfollow
				</Button>
			) : (
				<Button onClick={() => followUser(profileId)}>Follow</Button>
			)}
		</>
	);
};
