import { UserAvatar } from "@/components/UserAvatar";
import { api } from "@/trpc/react";
import { Link } from "@tanstack/react-router";

export const UserButton = () => {
	const { data: profile } = api.profiles.me.useQuery();

	return (
		<Link
			to="/$handle"
			params={{
				handle: String(profile?.handle),
			}}
		>
			<UserAvatar imageUrl={profile?.imageUrl ?? null} size={36} />
		</Link>
	);
};

export default UserButton;
