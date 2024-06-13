import { api } from "@/utils/api";
import React from "react";
import { View } from "react-native";
import { Button } from "./Button";

// const FollowersPopup = React.lazy(() => import("./FollowersPopup"));

const FollowerMenu = ({ profileId }: { profileId: string }) => {
	const { data: profile } = api.profiles.me.useQuery();

	const [followerCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "followers",
	});
	const [followingCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "following",
	});

	const showButton = !!profile && profile?.userId !== profileId;

	return (
		<View className="flex flex-row items-center justify-center gap-6 sm:justify-start">
			<View className="flex flex-col items-center gap-1">
				<Button variant={"secondary"} label={`100`} />
				<p className="text-sm font-medium">Reviews</p>
			</View>
			<View className="flex flex-col items-center gap-1">
				<Button variant={"secondary"} label={`${followerCount}`} />
				<p className="text-sm font-medium">Followers</p>
				{/* <FollowersPopup
					profileId={profileId}
					type="followers"
					followerCount={followerCount}
				/> */}
			</View>
			<View className="flex flex-col items-center gap-1">
				<Button variant={"secondary"} label={`${followingCount}`} />
				<p className="text-sm font-medium">Following</p>
				{/* <FollowersPopup
					profileId={profileId}
					type="following"
					followerCount={followingCount}
				/> */}
			</View>
			{/* {showButton ? <FollowButton profileId={profileId} /> : null} */}
		</View>
	);
};

export default FollowerMenu;
