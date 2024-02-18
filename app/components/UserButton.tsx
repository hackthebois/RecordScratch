import { UserAvatar } from "@/components/UserAvatar";
import { api } from "@/trpc/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const UserButton = () => {
	const navigate = useNavigate();
	const { data: profile, isSuccess } = api.profiles.me.useQuery();

	useEffect(() => {
		if (profile === null && isSuccess) {
			navigate({
				to: "/onboard",
			});
		}
	}, [profile, navigate, isSuccess]);

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
