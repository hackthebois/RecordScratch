import SignInButton from "@/components/SignInButton";
import { UserAvatar } from "@/components/UserAvatar";
import { SignOutItem, ThemeItem } from "@/components/UserButtonItems";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { SignedIn, SignedOut } from "../AuthProvider";
import { getMyProfile } from "../_trpc/cached";
import { revalidateUser } from "../actions";

export const UserButton = async () => {
	const { userId } = auth();

	if (!userId) {
		return null;
	}

	const profile = await getMyProfile(userId);

	if (!profile) {
		return null;
	}

	return (
		<>
			<SignedIn>
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
						<SignOutItem revalidateUser={revalidateUser} />
					</DropdownMenuContent>
				</DropdownMenu>
			</SignedIn>
			<SignedOut>
				<SignInButton />
			</SignedOut>
		</>
	);
};
