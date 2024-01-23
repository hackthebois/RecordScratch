import { getFollowCount, isUserFollowing } from "@/app/_api";
import FollowerMenuClient from "./FollowersMenuClient";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { followUser, unFollowUser } from "@/app/_api/actions";

type Props = {
	profileId: string;
};

const FollowerMenuServer = async ({ profileId }: Props) => {
	const followerCount = await getFollowCount(profileId);
	const followingCount = await getFollowCount(profileId, false);
	const isFollowing = await isUserFollowing(profileId);

	const { userId } = auth();
	const showButton = userId === null || userId === profileId;

	const followUsers = async (userId: string) => {
		"use server";
		await followUser(profileId);
		revalidateTag(`getFollowCount:${userId}`);
		revalidateTag(`isUserFollowing:${userId}`);
	};

	const unfollowUsers = async (userId: string) => {
		"use server";
		await unFollowUser(profileId);
		revalidateTag(`getFollowCount:${userId}`);
		revalidateTag(`isUserFollowing:${userId}`);
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
