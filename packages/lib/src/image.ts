import type { Profile } from "@recordscratch/types";

export const getImageUrl = (profile: Profile) => {
	return `${process.env.VITE_R2_PUBLIC_URL}/profile-images/${profile.userId}?updatedAt=${new Date(profile.updatedAt).getTime()}`;
};
