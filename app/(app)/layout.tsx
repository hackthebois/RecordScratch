import SearchBar from "@/components/SearchBar";
import { Discord } from "@/components/icons/Discord";
import { Button } from "@/components/ui/Button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { env } from "@/env.mjs";
import { Disc3, Github, Menu } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserButton from "../_auth/UserButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<header className="flex h-14 w-screen items-center justify-center border-b">
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
					<div className="flex items-center gap-3">
						<Suspense>
							<UserButton />
						</Suspense>
						<Popover>
							<PopoverTrigger asChild>
								<Button size="icon" variant="outline">
									<Menu size={22} />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="end">
								<div className="flex flex-col gap-2 text-sm font-semibold">
									<Link href="/roadmap">Roadmap</Link>
									<div className="flex gap-2">
										<Link
											href={env.NEXT_PUBLIC_GITHUB_URL}
											className="p-1"
											target="_blank"
										>
											<Discord size={23} />
										</Link>
										<Link
											href={env.NEXT_PUBLIC_GITHUB_URL}
											className="p-1"
											target="_blank"
										>
											<Github size={22} />
										</Link>
									</div>
								</div>
								<hr className="my-2" />
								<div className="flex items-center gap-2">
									<Link
										href="/terms"
										className="text-sm text-muted-foreground"
									>
										Terms
									</Link>
									<Link
										href="/privacy-policy"
										className="text-sm text-muted-foreground"
									>
										Privacy Policy
									</Link>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</nav>
			</header>
			<main className="mx-auto h-full w-full max-w-screen-lg flex-1 p-4 sm:p-6">
				{children}
			</main>
		</>
	);
};

export default Layout;
