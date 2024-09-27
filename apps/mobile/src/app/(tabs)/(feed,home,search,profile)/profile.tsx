import { useAuth } from "~/lib/auth";
import { ProfilePage } from "./[handle]";

const Profile = () => {
	const profile = useAuth((s) => s.profile);
	return <ProfilePage handle={profile!.handle} />;
};

export default Profile;
