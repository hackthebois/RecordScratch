import { getMyProfile } from "@/app/_trpc/cached";
import UserAvatar from "./UserAvatar";

const UserButton = async () => {
	const profile = await getMyProfile();

	if (!profile) {
		return null;
	}

	return <UserAvatar {...profile} size={36} />;
};

export default UserButton;
