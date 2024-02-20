import { api } from "@/trpc/react";
import { useAuth } from "@clerk/clerk-react";
import React from "react";
import { FollowButton } from "./FollowButton";

type Props = {
	profileId: string;
};

const FollowersPopup = React.lazy(() => import("./FollowersPopup"));

const FollowerMenu = ({ profileId }: Props) => {
	const { userId } = useAuth();
	const [followerCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "followers",
	});
	const [followingCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "following",
	});

	const showButton = !!userId && userId !== profileId;

	return (
		<div className="flex flex-row items-center justify-center gap-6 py-2 sm:justify-start">
			<div className="flex flex-col items-center gap-1">
				<p>Followers</p>
				<FollowersPopup
					profileId={profileId}
					type="followers"
					followerCount={followerCount}
				/>
			</div>
			<div className="flex flex-col items-center gap-1">
				<p>Following</p>
				<FollowersPopup
					profileId={profileId}
					type="following"
					followerCount={followingCount}
				/>
			</div>
			{showButton && <FollowButton profileId={profileId} />}
		</div>
	);
};

export default FollowerMenu;