import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

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
					<Button variant={"secondary"}>
						<Text>{totalRatings}</Text>
					</Button>
					<Text className="text-lg font-medium">Ratings</Text>
				</View>
				<View className="flex flex-col items-center gap-1">
					<Button
						variant={"secondary"}
						onPress={() => router.push(`${handleId}/followers`)}
					>
						<Text>{followerCount}</Text>
					</Button>
					<Text className="text-lg font-medium">Followers</Text>
				</View>
				<View className="flex flex-col items-center gap-1">
					<Button
						variant={"secondary"}
						onPress={() => router.push(`${handleId}/followers?type=following`)}
					>
						<Text>{followingCount}</Text>
					</Button>
					<Text className="text-lg font-medium">Following</Text>
				</View>
			</View>
		</View>
	);
};

export default FollowerMenu;
