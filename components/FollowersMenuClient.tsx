"use client";

import { revalidateTag } from "next/cache";
import { Button } from "./ui/Button";
import { followUser, unFollowUser } from "@/app/_api/actions";

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
		<div className="flex flex-row gap-6">
			<div className="flex flex-col items-center">
				<h6>Followers</h6>
				<h4>{followerCount}</h4>
			</div>
			<div className="flex flex-col items-center">
				<h6>Following</h6>
				<h4>{followingCount}</h4>
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
