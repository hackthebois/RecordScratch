import { api } from "@/utils/api";
import React from "react";
import { View } from "react-native";
import { Button } from "./Button";
import { Text } from "./Text";

const FollowersPopup = React.lazy(() => import("./FollowersPopup"));

const FollowerMenu = ({ profileId }: { profileId: string }) => {
	const [totalRatings] = api.profiles.getTotalRatings.useSuspenseQuery({
		userId: profileId,
	});

	const [followerCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "followers",
	});
	const [followingCount] = api.profiles.followCount.useSuspenseQuery({
		profileId,
		type: "following",
	});

	return (
		<View className="flex flex-col items-center">
			<View className="flex flex-row items-center justify-center gap-6 sm:justify-start">
				<View className="flex flex-col items-center gap-1">
					<Button variant={"secondary"} label={`${totalRatings}`} />
					<Text className="text-lg font-medium">Ratings</Text>
				</View>
				<View className="flex flex-col items-center gap-1">
					<FollowersPopup
						profileId={profileId}
						type="followers"
						followerCount={followerCount}
					/>
				</View>
				<View className="flex flex-col items-center gap-1">
					<FollowersPopup
						profileId={profileId}
						type="following"
						followerCount={followingCount}
					/>
				</View>
			</View>
		</View>
	);
};

export default FollowerMenu;
