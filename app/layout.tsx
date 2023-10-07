import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import Providers from "./Providers";
import SearchBar from "./SearchBar";
import SignInButton from "./SignInButton";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export const metadata = {
	title: "Treble",
	description: "Music rating and review app",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html
			lang="en"
			className="bg-elevation-1 m-0 w-full overflow-x-hidden text-white"
		>
			<body
				className={`${montserrat.className} m-0 flex h-full w-full flex-col overflow-hidden`}
			>
				<ClerkProvider>
					<Providers>
						<header className="border-elevation-4 bg-elevation-1 flex h-14 w-full items-center justify-center border-b">
							<nav className="flex w-full max-w-screen-xl items-center justify-between gap-3 p-4 sm:p-8">
								<Link
									href="/"
									className="hidden items-center justify-center sm:flex"
								>
									<h1 className="text-2xl font-medium">
										treble
									</h1>
								</Link>
								<SearchBar />
								<div className="flex items-center justify-center gap-3">
									<SignedIn>
										<UserButton afterSignOutUrl="/" />
									</SignedIn>
									<SignedOut>
										<SignInButton />
									</SignedOut>
									<ThemeToggle />
								</div>
							</nav>
						</header>
						<main className="flex flex-1">{children}</main>
					</Providers>
				</ClerkProvider>
			</body>
		</html>
	);
};

export default RootLayout;
