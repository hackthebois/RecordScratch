import SearchBar from "@/components/SearchBar";
import { Discord } from "@/components/icons/Discord";
import { Button } from "@/components/ui/Button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Disc3, Github, Menu } from "lucide-react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<header className="flex h-14 w-screen items-center justify-center border-b">
				<nav className="flex w-full max-w-screen-lg items-center justify-between gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-3">
						<Link to="/" className="flex items-center gap-3">
							<Button
								size="icon"
								variant="outline"
								aria-label="Home"
							>
								<Disc3 size={22} />
							</Button>
						</Link>
						<SearchBar/>
					</div>
				
					<div className="flex items-center gap-3">
						<Popover>
							<PopoverTrigger asChild>
								<Button size="icon" variant="outline">
									<Menu size={22} />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="end">
								<div className="flex flex-col gap-2 text-sm font-semibold">
									<Link to="/roadmap">Roadmap</Link>
									<div className="flex gap-2">
										<Link
											href={"https://google.com"}
											className="p-1"
											target="_blank"
										>
											<Discord size={23} />
										</Link>
										<Link
											href={"https://google.com"}
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
										to="/terms"
										className="text-sm text-muted-foreground"
									>
										Terms
									</Link>
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
			<main className="mx-auto h-full w-full max-w-screen-lg flex-1 p-4 sm:p-6">
				<Outlet />
			</main>
			<TanStackRouterDevtools />
		</QueryClientProvider>
	),
});
