import SearchBar from "@/components/SearchBar";
import SignedIn from "@/components/SignedIn";
import { useTheme } from "@/components/ThemeProvider";
import { Discord } from "@/components/icons/Discord";
import Github from "@/components/icons/Github";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import UserButton from "@/components/user/UserButton";
import { env } from "@/env";
import { api } from "@/trpc/react";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Bell, Dot, Menu } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_app")({
	component: () => (
		<LayoutComponent>
			<Outlet />
		</LayoutComponent>
	),
	notFoundComponent: () => (
		<LayoutComponent>
			<p>Not Found</p>
		</LayoutComponent>
	),
	errorComponent: ({ error }) => (
		<LayoutComponent>
			<ErrorComponent error={error} />
		</LayoutComponent>
	),
});

const NotificationBell = () => {
	const [unseen] = api.notifications.getUnseen.useSuspenseQuery();

	return (
		<Link
			to="/notifications"
			className={buttonVariants({
				variant: "outline",
				size: "icon",
				className: "relative",
			})}
		>
			<Bell size={20} />
			{unseen > 0 && (
				<div className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-[2px] border-background bg-[#fb8500] px-0.5">
					<p className="text-[10px]">{unseen > 9 ? "9+" : unseen}</p>
				</div>
			)}
		</Link>
	);
};

function LayoutComponent({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();

	return (
		<>
			<header className="flex h-14 w-screen items-center justify-center border-b">
				<nav className="flex w-full max-w-screen-lg items-center justify-between gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-3">
						<Link to="/" className="flex items-center gap-3">
							<Button
								size="icon"
								aria-label="Home"
								className="bg-white hover:bg-white"
								variant={"outline"}
							>
								<img
									src={"/logo.svg"}
									alt="Logo"
									className="h-7"
								/>
							</Button>
						</Link>
						<SearchBar />
					</div>
					<div className="flex items-center gap-3">
						<Suspense fallback={null}>
							<SignedIn>
								<NotificationBell />
							</SignedIn>
						</Suspense>
						<Suspense fallback={null}>
							<UserButton />
						</Suspense>
						<Popover>
							<PopoverTrigger asChild>
								<Button size="icon" variant="outline">
									<Menu size={22} />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="end" className="w-68">
								<div className="flex flex-col items-center gap-2 text-sm font-semibold">
									<div className="flex gap-2">
										<a
											href={env.VITE_DISCORD_URL}
											className="p-1"
											target="_blank"
										>
											<Discord size={23} />
										</a>
										<a
											href={env.VITE_GITHUB_URL}
											className="p-1"
											target="_blank"
										>
											<Github size={22} />
										</a>
									</div>
								</div>
								<hr className="my-2" />
								<div className="flex items-center justify-between">
									<Link
										to="/roadmap"
										className="text-sm text-muted-foreground"
									>
										Roadmap
									</Link>
									<Dot />
									<Link
										to="/terms"
										className="text-sm text-muted-foreground"
									>
										Terms
									</Link>
									<Dot />
									<Link
										to="/privacy-policy"
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
			<main className="mx-auto w-full max-w-screen-lg p-4 sm:p-6">
				{children}
			</main>
		</>
	);
}
