import { ProfilePage } from "../(users)/[handle]/index";
import { api } from "~/lib/api";

const Profile = () => {
	const [profile] = api.profiles.me.useSuspenseQuery();
	return <ProfilePage handleId={profile!.handle!} isProfile={true} />;
};

export default Profile;
