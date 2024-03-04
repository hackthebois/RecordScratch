import { Profile } from "@/types/profile";
import { Link } from "@tanstack/react-router";
import { FollowButton } from "./FollowButton";
import { UserAvatar } from "./UserAvatar";
import { api } from "@/trpc/react";

export const ProfileItem = ({
	profile,
	onClick,
}: {
	profile: Profile;
	onClick?: () => void;
}) => {
	const { data: myProfile } = api.profiles.me.useQuery();
	const showButton = !!myProfile && myProfile.userId !== profile.userId;

	return (
		<Link
			to="/$handle"
			params={{
				handle: String(profile.handle),
			}}
			onClick={onClick}
			className="flex flex-row items-center justify-between gap-4 rounded"
		>
			<div className="flex flex-row items-center">
				<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded-full">
					<UserAvatar {...profile} size={64} />
				</div>
				<div className="min-w-0 max-w-[5rem] truncate px-3 sm:max-w-[7rem] md:max-w-[10rem] lg:max-w-[12rem]">
					<p className="truncate font-medium">{profile.name}</p>
					<p className="truncate py-1 text-sm text-muted-foreground">
						{profile.handle}
					</p>
				</div>
			</div>
			{showButton && <FollowButton profileId={profile.userId} />}
		</Link>
	);
};
