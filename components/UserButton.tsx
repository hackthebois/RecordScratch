import { getMyProfile } from "@/app/_trpc/cached";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

const UserButton = async () => {
	const profile = await getMyProfile();

	if (!profile) {
		return null;
	}

	return (
		<Link href={`/${profile.handle}`}>
			<UserAvatar {...profile} size={40} />
		</Link>
	);
};

export default UserButton;
