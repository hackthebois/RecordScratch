import { getImageUrl } from "#/utils/image";
import { Profile } from "@recordscratch/types";
import { Link } from "expo-router";
import { View } from "react-native-ui-lib";
import { Text } from "#/components/CoreComponents/Text";
import { UserAvatar } from "#/components//UserAvatar";
import { FollowButton } from "../Followers/FollowButton";

export const ProfileItem = ({
	profile,
	onClick,
	isUser,
}: {
	profile: Profile;
	isUser: boolean;
	onClick?: () => void;
}) => {
	return (
		<Link
			href={{
				pathname: "/[handle]",
				params: { handle: String(profile.handle) },
			}}
			onPress={onClick}
		>
			<View className="flex flex-row justify-between items-center gap-4 rounded w-full">
				<View className="flex flex-row items-center">
					<UserAvatar imageUrl={getImageUrl(profile)} size={85} />
					<View className="min-w-0 truncate px-3">
						<Text className="truncate font-medium">{profile.name}</Text>
						<Text className="truncate py-1 text-sm text-muted-foreground">
							@{profile.handle}
						</Text>
					</View>
				</View>
				{!isUser ? <FollowButton profileId={profile.userId} /> : null}
			</View>
		</Link>
	);
};
