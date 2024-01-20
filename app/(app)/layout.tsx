import SearchBar from "@/app/_components/SearchBar";
import SignInButton from "@/app/_components/SignInButton";
import { Button } from "@/app/_components/ui/Button";
import UserButton from "@/app/_components/user/UserButton";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Disc3 } from "lucide-react";
import Link from "next/link";

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
							<UserButton />
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
