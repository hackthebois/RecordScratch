import { ThemeProvider } from "@/components/ThemeProvider";
import { TRPCReactProvider } from "@/trpc/react";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
} from "@tanstack/react-router";
import React, { Suspense } from "react";

const TanStackRouterDevtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: React.lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				}))
			);

export const Route = createRootRoute({
	component: Root,
});

function Root() {
	return (
		<TRPCReactProvider>
			<ThemeProvider defaultTheme="dark" storageKey="theme">
				<ScrollRestoration />
				<Outlet />
				<Suspense>
					<TanStackRouterDevtools />
				</Suspense>
			</ThemeProvider>
		</TRPCReactProvider>
	);
}
