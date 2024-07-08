import { SafeAreaView } from "react-native";
import { ProfilePage } from "../(users)/[handle]/index";
import { api } from "@/utils/api";

const Profile = () => {
	const [profile] = api.profiles.me.useSuspenseQuery();
	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<ProfilePage handleId={profile!.handle!} isProfile={true} />
		</SafeAreaView>
	);
};

export default Profile;
