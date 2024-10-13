import type { Profile } from "@recordscratch/types";
import env from "~/env";

export const getImageUrl = (profile: Profile) => {
	return `${env.R2_PUBLIC_URL}/profile-images/${profile.userId}?updatedAt=${new Date(profile.updatedAt).getTime()}`;
};
