import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { api } from "~/lib/api";
import StatBlock from "../CoreComponents/StatBlock";

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

	const links = [
		{
			label: "Ratings",
			value: totalRatings,
			to: `${handleId}/ratings`,
		},
		{
			label: "Followers",
			value: followerCount,
			to: `${handleId}/followers`,
		},
		{
			label: "Following",
			value: followingCount,
			to: `${handleId}/followers?type=following`,
		},
	];

	return (
		<View className="flex flex-col items-center">
			<View className="flex flex-row w-full gap-2">
				{links.map((link) => (
					<Link key={link.to} href={link.to} asChild>
						<Pressable className="flex-1">
							<StatBlock
								title={link.label}
								description={String(link.value)}
								size="sm"
							/>
						</Pressable>
					</Link>
				))}
			</View>
		</View>
	);
};

export default FollowerMenu;
