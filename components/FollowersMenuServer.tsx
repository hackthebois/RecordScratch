import { getFollowCount, getFollowProfiles, isUserFollowing } from "@/app/_api";
import FollowerMenuClient from "./FollowersMenuClient";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { followUser, unFollowUser } from "@/app/_api/actions";

type Props = {
	profileId: string;
};

const FollowerMenuServer = async ({ profileId }: Props) => {
	const { userId } = auth();

	// Execute API calls in parallel
	const [
		followerCount,
		followingCount,
		isFollowing,
		followerProfiles,
		followingProfiles,
	] = await Promise.all([
		getFollowCount(profileId, true),
		getFollowCount(profileId, false),
		isUserFollowing(profileId, userId || "0"),
		getFollowProfiles(profileId, true),
		getFollowProfiles(profileId, false),
	]);

	const showButton = userId === null || userId === profileId;

	const followUsers = async (profileId: string) => {
		"use server";
		await followUser(profileId);
		revalidateTag(`getFollowCount:${profileId}:${true}`);
		revalidateTag(`getFollowCount:${userId}:${false}`);
		revalidateTag(`isUserFollowing:${profileId}:${userId}`);
		revalidateTag(`getFollowProfiles:${profileId}:${true}`);
		revalidateTag(`getFollowProfiles:${userId}:${false}`);
	};

	const unfollowUsers = async (profileId: string) => {
		"use server";
		await unFollowUser(profileId);
		revalidateTag(`getFollowCount:${profileId}:${true}`);
		revalidateTag(`getFollowCount:${userId}:${false}`);
		revalidateTag(`isUserFollowing:${profileId}:${userId}`);
		revalidateTag(`getFollowProfiles:${profileId}:${true}`);
		revalidateTag(`getFollowProfiles:${userId}:${false}`);
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
			followerProfiles={followerProfiles}
			followingProfiles={followingProfiles}
		/>
	);
};

export default FollowerMenuServer;
