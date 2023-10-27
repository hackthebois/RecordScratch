import { RatingDialogProvider } from "@/components/rating/RatingDialog";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Disc3 } from "lucide-react";
import { AxiomWebVitals } from "next-axiom";
import { Montserrat } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { Providers } from "./Providers";
import SearchBar from "./SearchBar";
import SignInButton from "./SignInButton";
import UserButton from "./UserButton";
import { TRPCReactProvider } from "./_trpc/react";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export const metadata = {
	title: "RecordScratch",
	description: "Music rating and review app",
};

type Props = {
	children: React.ReactNode;
};

export const runtime = "edge";
export const preferredRegion = "cle1";

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<AxiomWebVitals />
			<body
				className={`${montserrat.className} flex h-[100svh] flex-col`}
			>
				<ClerkProvider
					appearance={{
						variables: {
							colorPrimary: "hsl(0 0% 9%)",
							colorDanger: "hsl(0 84.2% 60.2%)",
							borderRadius: "0.5rem",
						},
					}}
				>
					<TRPCReactProvider headers={headers()}>
						<Providers>
							<header className="border-elevation-4 bg-elevation-1 flex h-14 w-full items-center justify-center border-b">
								<nav className="flex w-full max-w-screen-lg items-center justify-between gap-3 p-4 sm:p-6">
									<div className="flex items-center gap-3">
										<Link
											href="/"
											className="flex items-center gap-3"
										>
											<Button
												size="icon"
												variant="outline"
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
										<ThemeToggle />
									</div>
								</nav>
							</header>
							<ScrollArea className="flex h-full w-screen flex-1">
								<main className="mx-auto w-screen max-w-screen-lg p-4 sm:p-6">
									{children}
								</main>
							</ScrollArea>
							<RatingDialogProvider />
						</Providers>
					</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
};

export default RootLayout;
