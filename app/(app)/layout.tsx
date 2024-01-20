import { getMyProfile } from "@/app/_trpc/cached";
import SearchBar from "@/components/SearchBar";
import SignInButton from "@/components/SignInButton";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { SignedIn, SignedOut, auth } from "@clerk/nextjs";
import { Disc3 } from "lucide-react";
import Link from "next/link";

import { UserAvatar } from "@/components/UserAvatar";
import { SignOutItem, ThemeItem } from "@/components/UserButtonItems";
import { Suspense } from "react";

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

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<header className="flex h-14 w-full items-center justify-center border-b">
				<nav className="flex w-full max-w-screen-lg items-center justify-between gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center gap-3">
							<Button
								size="icon"
								variant="outline"
								aria-label="Home"
							>
								<Disc3 size={22} />
							</Button>
						</Link>
						<SearchBar />
					</div>
					<div className="flex items-center justify-center gap-3">
						<SignedIn>
							<Suspense fallback={null}>
								<UserButton />
							</Suspense>
						</SignedIn>
						<SignedOut>
							<SignInButton />
						</SignedOut>
					</div>
				</nav>
			</header>
			<main className="mx-auto w-full max-w-screen-lg p-4 sm:p-6">
				{children}
			</main>
		</>
	);
};

export default Layout;
