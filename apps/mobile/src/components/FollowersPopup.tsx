import { api } from "@/utils/api";
import { ScrollView, View } from "react-native";
import { ProfileItem } from "./ProfileItem";
import DialogComponent from "./DialogComponent";
import { useState } from "react";
import { Button } from "./Button";
import { Text } from "./Text";

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
	const [open, setOpen] = useState(false);

	return (
		<View>
			<DialogComponent
				open={open}
				setOpen={setOpen}
				ignoreBackgroundPress={true}
				className="p-4 flex"
			>
				<ScrollView className="flex max-h-96 flex-col gap-3">
					<View className="flex flex-col gap-4 pb-4">
						{profiles?.map(({ profile }, index) => (
							<ProfileItem key={index} profile={profile} />
						))}
					</View>
				</ScrollView>
			</DialogComponent>
			<Button
				variant={"secondary"}
				label={`${followerCount}`}
				onPress={() => setOpen(true)}
			/>
			<Text className="text-lg font-medium">
				{type === "followers" ? "Followers" : "Following"}
			</Text>
		</View>
	);
};

export default FollowersPopup;
