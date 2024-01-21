import SignInButton from "@/components/SignInButton";
import { UserButtonDropdown } from "@/components/UserButtonDropdown";
import { auth } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { getMyProfile } from "../_trpc/cached";
import { revalidateUser, updateProfile } from "../actions";

export const UserButton = async () => {
	unstable_noStore();
	const { userId } = auth();

	if (!userId) {
		return <SignInButton />;
	}

	const profile = await getMyProfile();

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
