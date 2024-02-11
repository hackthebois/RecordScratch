import { getFollowCount, getFollowProfiles, isUserFollowing } from "@/app/_api";
import { auth } from "@clerk/nextjs";
import { FollowButton } from "./FollowButton";
import FollowersPopup from "./FollowersPopup";

type Props = {
	profileId: string;
};

const FollowerMenu = async ({ profileId }: Props) => {
	const { userId } = auth();

	// Execute API calls in parallel
	const [
		followerCount,
		followingCount,
		isFollowing,
		followerProfiles,
		followingProfiles,
	] = await Promise.all([
		getFollowCount(profileId, "followers"),
		getFollowCount(profileId, "following"),
		isUserFollowing(profileId, userId),
		getFollowProfiles(profileId, userId, "followers"),
		getFollowProfiles(profileId, userId, "following"),
	]);

	const showButton = !!userId && userId !== profileId;

	return (
		<div className="flex flex-row items-center justify-center gap-6 py-2 sm:justify-start">
			<div className="flex flex-col items-center gap-1">
				<p>Followers</p>
				<FollowersPopup
					title={"Followers"}
					followerCount={followerCount}
					profiles={followerProfiles}
					userId={userId}
				/>
			</div>
			<div className="flex flex-col items-center gap-1">
				<p>Following</p>
				<FollowersPopup
					title={"Following"}
					followerCount={followingCount}
					profiles={followingProfiles}
					userId={userId}
				/>
			</div>
			{showButton && (
				<FollowButton
					profileId={profileId}
					initialIsFollowing={isFollowing}
					userId={userId}
				/>
			)}
		</div>
	);
};

export default FollowerMenu;
