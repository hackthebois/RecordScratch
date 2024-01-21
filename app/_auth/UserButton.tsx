import SignInButton from "@/components/SignInButton";
import { UserButtonDropdown } from "@/components/UserButtonDropdown";
import { auth } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import AuthProvider from "../AuthProvider";
import { getMyProfile } from "../_trpc/cached";
import { revalidateUser, updateProfile } from "../actions";

export const UserButton = async () => {
	unstable_noStore();
	const { userId } = auth();

	if (!userId) {
		return (
			<AuthProvider>
				<SignInButton />
			</AuthProvider>
		);
	}

	const profile = await getMyProfile();

	if (!profile) {
		return null;
	}

	return (
		<AuthProvider>
			<UserButtonDropdown
				profile={profile}
				updateProfile={updateProfile}
				revalidateUser={revalidateUser}
			/>
		</AuthProvider>
	);
};

export default UserButton;
