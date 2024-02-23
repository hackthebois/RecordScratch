import { api } from "@/trpc/react";
import React from "react";
import { FollowButton } from "./FollowButton";

type Props = {
	profileId: string;
};

const FollowersPopup = React.lazy(() => import("./FollowersPopup"));

const FollowerMenu = ({ profileId }: Props) => {
	const { data: profile } = api.profiles.me.useQuery();

	const [followerCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "followers",
	});
	const [followingCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "following",
	});

	const showButton = !!profile?.userId && profile?.userId !== profileId;

	return (
		<div className="flex flex-row items-center justify-center gap-6 sm:justify-start">
			<div className="flex flex-col items-center gap-1">
				<p className="text-sm font-medium">Followers</p>
				<FollowersPopup
					profileId={profileId}
					type="followers"
					followerCount={followerCount}
				/>
			</div>
			<div className="flex flex-col items-center gap-1">
				<p className="text-sm font-medium">Following</p>
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
