import { env } from "@/env";
import { Profile } from "@/types/profile";

export const getImageUrl = (profile: Profile) => {
	return `${env.VITE_R2_PUBLIC_URL}/profile-images/${profile.userId}?updatedAt=${profile.updatedAt.getTime()}`;
};
