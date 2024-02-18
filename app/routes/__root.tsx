import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
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
		<ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
			<TRPCReactProvider>
				<Outlet />
				<Suspense>
					<TanStackRouterDevtools />
				</Suspense>
			</TRPCReactProvider>
		</ClerkProvider>
	);
}
