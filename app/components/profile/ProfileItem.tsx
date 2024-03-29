import { api } from "@/trpc/react";
import { Profile } from "@/types/profile";
import { getImageUrl } from "@/utils/image";
import { Link } from "@tanstack/react-router";
import { FollowButton } from "../followers/FollowButton";
import { UserAvatar } from "../user/UserAvatar";

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
				<div className="relative min-w-[64px] overflow-hidden rounded-full">
					<UserAvatar
						imageUrl={getImageUrl(profile)}
						className={"h-16 w-16 overflow-hidden rounded-full"}
					/>
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
