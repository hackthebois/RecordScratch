import { UserAvatar } from "@/components/UserAvatar";
import { api } from "@/trpc/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { buttonVariants } from "./ui/Button";

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

	if (!profile && isSuccess) {
		return (
			<a href="/auth/google" className={buttonVariants({})}>
				Sign In
			</a>
		);
	}

	return (
		<Link
			to="/$handle"
			params={{
				handle: String(profile?.handle),
			}}
		>
			<UserAvatar
				imageUrl={profile?.imageUrl ?? null}
				size={40}
				className="border-muted border"
			/>
		</Link>
	);
};

export default UserButton;
