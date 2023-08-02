import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { BiAlbum } from "react-icons/bi";
import Providers from "./Providers";
import SearchBar from "./SearchBar";
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
		<ClerkProvider>
			<Providers>
				<html lang="en" className="bg-elevation-1 text-white">
					<body
						className={`${montserrat.className} flex min-h-screen flex-col`}
					>
						<header className="flex h-14 w-full items-center justify-center border-b border-elevation-4 bg-elevation-1">
							<nav className="flex w-full max-w-screen-xl  items-center justify-between p-4 sm:p-8">
								<Link
									href="/"
									className="flex items-center justify-center"
								>
									<BiAlbum size={30} color="white" />
									<h1 className="ml-2 hidden text-2xl font-medium sm:block">
										treble
									</h1>
								</Link>
								<SearchBar />
								<div>
									<SignedIn>
										<UserButton afterSignOutUrl="/" />
									</SignedIn>
									<SignedOut>
										<Link
											href="/sign-in"
											className="mr-2 rounded border border-elevation-4 bg-elevation-1 px-4 py-2 text-sm"
										>
											Sign In
										</Link>
										<Link
											href="/sign-up"
											className="rounded bg-elevation-4 px-4 py-2 text-sm"
										>
											Sign Up
										</Link>
									</SignedOut>
								</div>
							</nav>
						</header>
						<main className="flex flex-1">{children}</main>
					</body>
				</html>
			</Providers>
		</ClerkProvider>
	);
};

export default RootLayout;
