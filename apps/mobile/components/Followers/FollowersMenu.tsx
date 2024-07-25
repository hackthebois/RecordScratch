import { api } from "~/lib/api";
import React from "react";
import { View } from "react-native";
import { Button } from "~/components/CoreComponents/Button";
import { Text } from "~/components/CoreComponents/Text";
import { router } from "expo-router";

const FollowerMenu = ({ profileId, handleId }: { profileId: string; handleId: string }) => {
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
					<Button
						variant={"secondary"}
						label={`${followerCount}`}
						onPress={() => router.push(`${handleId}/followers`)}
					/>
					<Text className="text-lg font-medium">Followers</Text>
				</View>
				<View className="flex flex-col items-center gap-1">
					<Button
						variant={"secondary"}
						label={`${followingCount}`}
						onPress={() => router.push(`${handleId}/followers?type=following`)}
					/>
					<Text className="text-lg font-medium">Following</Text>
				</View>
			</View>
		</View>
	);
};

export default FollowerMenu;
