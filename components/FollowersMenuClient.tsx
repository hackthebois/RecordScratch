"use client";

import { Button } from "./ui/Button";
import { followUser } from "@/app/_api/actions";

type PropsClient = {
	profileId: string;
	followerCount: number;
	followingCount: number;
	isFollowing: boolean;
	showButton: boolean;
};

const FollowerMenuClient = ({
	profileId,
	followerCount,
	followingCount,
	isFollowing,
	showButton,
}: PropsClient) => {
	const followUsers = async () => {
		await followUser(profileId);
	};

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
				<Button disabled={true}>Following</Button>
			) : !showButton ? (
				<Button onClick={followUsers}>Follow</Button>
			) : null}
		</div>
	);
};

export default FollowerMenuClient;
