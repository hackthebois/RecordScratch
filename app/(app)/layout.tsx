import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Disc3 } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<header className="border-elevation-4 bg-elevation-1 flex h-14 w-full items-center justify-center border-b">
				<nav className="flex w-full max-w-screen-lg items-center justify-between gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center gap-3">
							<Button size="icon" variant="outline">
								<Disc3 size={22} />
							</Button>
						</Link>
						<SearchBar />
					</div>
					<div className="flex items-center justify-center gap-3">
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<SignInButton />
						</SignedOut>
						<ThemeToggle />
					</div>
				</nav>
			</header>
			<ScrollArea className="flex h-full w-screen flex-1">
				<main className="mx-auto w-screen max-w-screen-lg p-4 sm:p-6">
					{children}
				</main>
			</ScrollArea>
		</div>
	);
};

export default Layout;
