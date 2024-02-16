import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: () => (
		<ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
			<TRPCReactProvider>
				<Outlet />
				<TanStackRouterDevtools />
			</TRPCReactProvider>
		</ClerkProvider>
	),
});
