import { getFollowCount, isUserFollowing } from "@/app/_api";
import FollowerMenuClient from "./FollowersMenuClient";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { followUser, unFollowUser } from "@/app/_api/actions";

type Props = {
	profileId: string;
};

const FollowerMenuServer = async ({ profileId }: Props) => {
	const { userId } = auth();

	const followerCount = await getFollowCount(profileId);
	const followingCount = await getFollowCount(profileId, false);
	const isFollowing = await isUserFollowing(profileId, userId || "0");

	const showButton = userId === null || userId === profileId;

	const followUsers = async (profileId: string) => {
		"use server";
		await followUser(profileId);
		revalidateTag(`getFollowCount:${profileId}`);
		revalidateTag(`isUserFollowing:${profileId}:${userId}`);
	};

	const unfollowUsers = async (profileId: string) => {
		"use server";
		await unFollowUser(profileId);
		revalidateTag(`getFollowCount:${profileId}`);
		revalidateTag(`isUserFollowing:${profileId}:${userId}`);
	};

	return (
		<FollowerMenuClient
			profileId={profileId}
			followerCount={followerCount}
			followingCount={followingCount}
			isFollowing={isFollowing}
			showButton={showButton}
			followUser={followUsers}
			unFollowUser={unfollowUsers}
		/>
	);
};

export default FollowerMenuServer;
