import { getFollowCount, isUserFollowing } from "@/app/_api";
import FollowerMenuClient from "./FollowersMenuClient";
import { auth } from "@clerk/nextjs";

type Props = {
	profileId: string;
};

const FollowerMenuServer = async ({ profileId }: Props) => {
	const followerCount = await getFollowCount(profileId);
	const followingCount = await getFollowCount(profileId, false);
	const isFollowing = await isUserFollowing(profileId);

	const { userId } = auth();
	const showButton = userId === null || userId === profileId;

	return (
		<FollowerMenuClient
			profileId={profileId}
			followerCount={followerCount}
			followingCount={followingCount}
			isFollowing={isFollowing}
			showButton={showButton}
		/>
	);
};

export default FollowerMenuServer;
