import { Discord } from "@/components/icons/Discord";
import { Github } from "@/components/icons/Github";
import { Tiktok } from "@/components/icons/Tiktok";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import SearchBar from "@/components/SearchBar";
import SignedIn from "@/components/SignedIn";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import UserButton from "@/components/user/UserButton";
import { api } from "@/trpc/react";
import { socials } from "@recordscratch/lib";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Bell, Dot, Mail, Menu } from "lucide-react";
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
								<div className="flex flex-col gap-1">
									<div className="flex gap-2">
										<a
											href={socials.discord}
											className="p-1"
											target="_blank"
										>
											<Discord size={23} />
										</a>
										<a
											href={socials.github}
											className="p-1"
											target="_blank"
										>
											<Github size={22} />
										</a>
										<a
											href={"mailto:" + socials.email}
											className="p-1"
											target="_blank"
										>
											<Mail size={22} />
										</a>
										<a
											href={socials.tiktok}
											className="p-1"
											target="_blank"
										>
											<Tiktok size={22} />
										</a>
									</div>
									<Link
										to="/roadmap"
										className="text-sm text-muted-foreground"
									>
										Roadmap
									</Link>
									<Link
										to="/support"
										className="text-sm text-muted-foreground"
									>
										Support
									</Link>
								</div>
								<hr className="my-2" />
								<div className="flex items-center justify-between">
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
