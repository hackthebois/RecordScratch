import SignInButton from "@/components/SignInButton";
import { UserButtonDropdown } from "@/components/UserButtonDropdown";
import { auth } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { revalidateUser, updateProfile } from "../_api/actions";
import { getMyProfile } from "../_api/cached";

export const UserButton = async () => {
	unstable_noStore();
	const { userId } = auth();

	if (!userId) {
		return <SignInButton />;
	}

	const profile = await getMyProfile(userId);

	if (!profile) {
		return null;
	}

	return (
		<UserButtonDropdown
			profile={profile}
			updateProfile={updateProfile}
			revalidateUser={revalidateUser}
		/>
	);
};

export default UserButton;
