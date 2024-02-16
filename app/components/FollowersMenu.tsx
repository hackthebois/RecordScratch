import { api } from "@/trpc/react";
import { useAuth } from "@clerk/clerk-react";
import { FollowButton } from "./FollowButton";
import FollowersPopup from "./FollowersPopup";

type Props = {
	profileId: string;
};

const FollowerMenu = ({ profileId }: Props) => {
	const { userId } = useAuth();
	const [followerCount] = api.profiles.followCount.useSuspenseQuery({
		userId: profileId,
		type: "followers",
	});
	const [followingCount] = api.profiles.followCount.useSuspenseQuery({
		userId: profileId,
		type: "following",
	});
	const [followerProfiles] = api.profiles.followProfiles.useSuspenseQuery({
		profileId,
		type: "followers",
	});
	const [followingProfiles] = api.profiles.followProfiles.useSuspenseQuery({
		profileId,
		type: "following",
	});

	const showButton = !!userId && userId !== profileId;

	return (
		<div className="flex flex-row items-center justify-center gap-6 py-2 sm:justify-start">
			<div className="flex flex-col items-center gap-1">
				<p>Followers</p>
				<FollowersPopup
					title={"Followers"}
					followerCount={followerCount}
					profiles={followerProfiles}
				/>
			</div>
			<div className="flex flex-col items-center gap-1">
				<p>Following</p>
				<FollowersPopup
					title={"Following"}
					followerCount={followingCount}
					profiles={followingProfiles}
				/>
			</div>
			{showButton && <FollowButton profileId={profileId} />}
		</div>
	);
};

export default FollowerMenu;
