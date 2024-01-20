import { getMyProfile } from "@/app/_trpc/cached";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import UserAvatar from "../../UserAvatar";
import { Button } from "../../ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../ui/DropdownMenu";
import { SignOutItem, ThemeItem } from "./Items";

const UserButton = async () => {
	const { userId } = auth();

	if (!userId) {
		return null;
	}

	const profile = await getMyProfile(userId);

	if (!profile) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-[36px] w-[36px] rounded-full"
				>
					<UserAvatar {...profile} size={36} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="bottom"
				sideOffset={18}
				className="absolute -right-5 w-40"
			>
				<DropdownMenuItem asChild>
					<Link
						href={`/${profile.handle}`}
						className="flex flex-col gap-1"
					>
						<span className="w-full">{profile.name}</span>
						<span className="w-full text-xs text-muted-foreground">
							Go to profile
						</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<ThemeItem />
				<SignOutItem />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
