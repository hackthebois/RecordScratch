import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/Button";
import { Disc3 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

const UserButton = dynamic(() => import("../_auth/UserButton"), {
	ssr: false,
});

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
					<Suspense>
						<UserButton />
					</Suspense>
				</nav>
			</header>
			<main className="mx-auto w-full max-w-screen-lg p-4 sm:p-6">
				{children}
			</main>
		</>
	);
};

export default Layout;
