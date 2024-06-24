import { SafeAreaView } from "react-native";
import { ProfilePage } from "../profiles/[handle]";
import { api } from "@/utils/api";

const Profile = () => {
	// const handle = api.profiles.me.useSuspenseQuery()
	const handle = "fil";
	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<ProfilePage handleId={handle} isProfile={true} />
		</SafeAreaView>
	);
};

export default Profile;
