import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "ui";
import Link from "next/link";

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
						<nav className="flex max-w-screen-lg p-4 sm:p-8 justify-end w-full">
							<SignedIn>
								<UserButton afterSignOutUrl="/" />
							</SignedIn>
							<SignedOut>
								<Link
									href="/sign-in"
									className="px-4 py-2 bg-elevation-1 border border-elevation-4 rounded mr-2"
								>
									Sign In
								</Link>
								<Link href="/sign-up" className="px-4 py-2 bg-elevation-4 rounded">
									Sign Up
								</Link>
							</SignedOut>
						</nav>
					</header>
					<main className="flex-1 flex">{children}</main>
				</body>
			</html>
		</ClerkProvider>
	);
};

export default RootLayout;
