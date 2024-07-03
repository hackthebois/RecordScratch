import { getImageUrl } from "@/utils/image";
import { Profile } from "@recordscratch/types";
import { Link } from "expo-router";
import { View } from "react-native-ui-lib";
import { Text } from "./Text";
import { UserAvatar } from "./UserAvatar";

export const ProfileItem = ({ profile, onClick }: { profile: Profile; onClick?: () => void }) => {
	// const { data: myProfile } = api.profiles.me.useQuery();

	// const showButton = !!myProfile && myProfile.userId !== profile.userId;

	return (
		<Link
			href={{
				pathname: "/profiles/[handle]",
				params: { handle: String(profile.handle) },
			}}
			onPress={onClick}
			className="flex flex-row items-center justify-between gap-4 rounded"
		>
			<View className="flex flex-row items-center">
				<View className="relative min-w-[64px] overflow-hidden rounded-full">
					<UserAvatar imageUrl={getImageUrl(profile)} size={85} />
				</View>
				<View className="min-w- truncate px-3">
					<Text className="truncate font-medium">{profile.name}</Text>
					<Text className="truncate py-1 text-sm text-muted-foreground">
						{profile.handle}
					</Text>
				</View>
			</View>
			{/* {showButton && <FollowButton profileId={profile.userId} />} */}
		</Link>
	);
};
