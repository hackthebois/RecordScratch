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
	title: "Note",
	description: "Music rating and review app",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<Providers>
				<html lang="en" className="bg-elevation-1 text-white">
					<body className={`${montserrat.className} flex flex-col min-h-screen`}>
						<header className="bg-elevation-1 w-full flex justify-center h-14 items-center border-b border-elevation-4">
							<nav className="flex max-w-screen-xl items-center  p-4 sm:p-8 justify-between w-full">
								<Link href="/" className="flex items-center justify-center">
									<BiAlbum size={30} color="white" />
									<h1 className="text-2xl font-medium ml-2 hidden sm:block">
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
											className="px-4 py-2 bg-elevation-1 border border-elevation-4 rounded mr-2 text-sm"
										>
											Sign In
										</Link>
										<Link
											href="/sign-up"
											className="px-4 py-2 bg-elevation-4 rounded text-sm"
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
			</Providers>
		</ClerkProvider>
	);
};

export default RootLayout;
