import { SafeAreaView } from "react-native";
import { ProfilePage } from "../profiles/[handle]";
import { api } from "@/utils/api";
import { useAuth } from "@/utils/Authentication";

const Profile = () => {
	const { sessionId } = useAuth();
	console.log(`SESSIONID: ${sessionId}`);
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
