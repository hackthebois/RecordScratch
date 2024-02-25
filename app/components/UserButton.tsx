import { UserAvatar } from "@/components/UserAvatar";
import { api } from "@/trpc/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { buttonVariants } from "./ui/Button";

export const UserButton = () => {
	const navigate = useNavigate();
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();

	if (needsOnboarding) {
		navigate({
			to: "/onboard",
		});
	}

	if (!profile) {
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
				handle: String(profile.handle),
			}}
		>
			<UserAvatar
				imageUrl={profile.imageUrl}
				size={40}
				className="border border-muted"
			/>
		</Link>
	);
};

export default UserButton;
