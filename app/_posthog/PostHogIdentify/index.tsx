import { getMyProfile } from "@/app/_api";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { ClientIdentify } from "./ClientIdentify";

export const PostHogIdentify = async () => {
	unstable_noStore();
	const user = await currentUser();

	if (!user) {
		return null;
	}

	const profile = await getMyProfile(user.id);

	if (!profile) {
		return null;
	}

	return (
		<ClientIdentify
			userId={user.id}
			email={
				user.emailAddresses.length > 0
					? user.emailAddresses[0].emailAddress
					: undefined
			}
			handle={profile.handle}
			name={profile.name}
		/>
	);
};
