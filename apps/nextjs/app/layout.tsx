import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import { BiAlbum } from "react-icons/bi";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Note",
	description: "Music rating and review app",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<html lang="en" className="bg-elevation-1 text-white">
				<body className={`${inter.className} flex flex-col min-h-screen`}>
					<header className="bg-elevation-1 w-full flex justify-center h-14 items-center border-b border-elevation-4">
						<nav className="flex max-w-screen-xl items-center  p-4 sm:p-8 justify-between w-full">
							<Link href="/" className="flex items-center justify-center">
								<BiAlbum size={30} color="white" />
								<h1 className="text-2xl font-medium ml-2 hidden sm:block">
									treble
								</h1>
							</Link>
							<div>
								<SignedIn>
									<UserButton afterSignOutUrl="/" />
								</SignedIn>
								<SignedOut>
									<Link
										href="/sign-in"
										className="px-4 py-2 bg-elevation-1 border border-elevation-4 rounded mr-2 text-sm sm:text-base"
									>
										Sign In
									</Link>
									<Link
										href="/sign-up"
										className="px-4 py-2 bg-elevation-4 rounded text-sm sm:text-base"
									>
										Sign Up
									</Link>
								</SignedOut>
							</div>
						</nav>
					</header>
					<main className="flex-1 flex">{children}</main>
				</body>
			</html>
		</ClerkProvider>
	);
};

export default RootLayout;
