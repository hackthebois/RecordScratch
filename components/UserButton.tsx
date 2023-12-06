"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useClerk, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import Link from "next/link";

const UserButton = () => {
	const clerkTheme = useTheme().theme === "dark" ? dark : undefined;
	const { openUserProfile, signOut } = useClerk();
	const { user } = useUser();

	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-9 w-9 rounded-full"
				>
					<Avatar className="h-9 w-9">
						<AvatarImage src={user.imageUrl} alt="User icon" />
						<AvatarFallback>
							{user.firstName ? user.firstName[0] : "U"}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.firstName} {user.lastName}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.emailAddresses[0].emailAddress}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={`/${user.username}`}>Profile</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						openUserProfile({
							appearance: {
								baseTheme: clerkTheme,
							},
						})
					}
				>
					Account
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => signOut()}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
