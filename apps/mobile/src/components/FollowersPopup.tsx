import { api } from "@/utils/api";
import { ScrollView, View } from "react-native";
import { ProfileItem } from "./ProfileItem";

const FollowersPopup = ({
	followerCount,
	type,
	profileId,
}: {
	followerCount: number;
	type: "followers" | "following";
	profileId: string;
}) => {
	const { data: profiles } = api.profiles.followProfiles.useQuery({
		profileId,
		type,
	});

	return (
		<ScrollView className="flex max-h-96 flex-col gap-3">
			<View className="flex flex-col gap-4 pb-4">
				{profiles?.map(({ profile }, index) => (
					<ProfileItem key={index} profile={profile} />
				))}
			</View>
		</ScrollView>
	);
};

export default FollowersPopup;
