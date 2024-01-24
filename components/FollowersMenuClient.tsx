"use client";

import { Button } from "./ui/Button";
import { Tag } from "./ui/Tag";

type Props = {
	profileId: string;
	followerCount: number;
	followingCount: number;
	isFollowing: boolean;
	showButton: boolean;
	followUser: Function;
	unFollowUser: Function;
};

const FollowerMenuClient = ({
	profileId,
	followerCount,
	followingCount,
	isFollowing,
	showButton,
	followUser,
	unFollowUser,
}: Props) => {
	return (
		<div className="flex flex-row justify-center gap-6 py-2 sm:justify-start">
			<div className="flex flex-col items-center gap-1">
				<p>Followers</p>
				<Tag>{followerCount}</Tag>
			</div>
			<div className="flex flex-col items-center gap-1">
				<p>Following</p>
				<Tag>{followingCount}</Tag>
			</div>
			{isFollowing ? (
				<Button
					className="rounded-md bg-gray-300 opacity-50"
					onClick={() => unFollowUser(profileId)}
				>
					unfollow
				</Button>
			) : !showButton ? (
				<Button onClick={() => followUser(profileId)}>Follow</Button>
			) : null}
		</div>
	);
};

export default FollowerMenuClient;
