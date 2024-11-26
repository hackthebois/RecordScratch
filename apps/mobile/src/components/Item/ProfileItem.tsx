import { UserAvatar } from "@/components//UserAvatar";
import { Text } from "@/components/ui/text";
import { getImageUrl } from "@/lib/image";
import { Profile } from "@recordscratch/types";
import { Link } from "expo-router";
import { View } from "react-native";

export const ProfileItem = ({
	profile,
	onClick,
	isUser,
	size = 60,
	showType = false,
}: {
	profile: Profile;
	isUser: boolean;
	onClick?: () => void;
	size?: number;
	showType?: boolean;
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
				<View className="flex flex-row items-center gap-4">
					<UserAvatar imageUrl={getImageUrl(profile)} size={size} />
					<View className="justify-center gap-1">
						<Text className="flex font-semibold" numberOfLines={2}>
							{profile.name}
						</Text>
						<Text className="text-muted-foreground">
							{showType ? "User • " : ""}@{profile.handle}
						</Text>
					</View>
				</View>
				{/* {!isUser ? <FollowButton profileId={profile.userId} /> : null} */}
			</View>
		</Link>
	);
};
