import { ProfileDialog } from "@/components/ProfileDialog";
import { auth } from "@clerk/nextjs";
import { getProfile } from "../_trpc/cached";
import { updateProfile } from "../actions";

export const EditProfileButton = async ({ handle }: { handle: string }) => {
	const profile = await getProfile(handle);
	const { userId } = auth();

	if (profile?.userId === userId) {
		return (
			<ProfileDialog profile={profile} updateProfile={updateProfile} />
		);
	}

	return null;
};
