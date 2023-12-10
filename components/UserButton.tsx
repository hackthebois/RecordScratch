import { serverTrpc } from "@/app/_trpc/server";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

const UserButton = async () => {
	const profile = await serverTrpc.user.profile.me();

	if (!profile) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-9 w-9 rounded-full"
				>
					<UserAvatar
						imageUrl={profile.imageUrl ?? undefined}
						name={profile.name}
						size={36}
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{profile.name}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{profile.handle}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={`/${profile.handle}`}>Profile</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
