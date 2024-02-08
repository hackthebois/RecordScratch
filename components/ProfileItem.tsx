"use client";

import { Profile } from "@/types/profile";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";

export const ProfileItem = ({
	profile,
	onClick,
}: {
	profile: Profile;
	onClick: () => void;
}) => {
	return (
		<Link
			href={`/${profile.handle}`}
			onClick={onClick}
			className="flex flex-row items-center gap-4 rounded"
		>
			<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded-full">
				<UserAvatar {...profile} size={64} />
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{profile.name}</p>
				<p className="truncate py-1 text-sm text-muted-foreground">
					{profile.handle}
				</p>
			</div>
		</Link>
	);
};
