import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import React, { Suspense, useEffect } from "react";

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

const UserOnboardRedirect = () => {
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.publicMetadata.onboarded === false) {
			navigate({
				to: "/onboard",
			});
		}
	}, [user, navigate]);

	return null;
};

function Root() {
	return (
		<ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
			<TRPCReactProvider>
				<Outlet />
				<UserOnboardRedirect />
				<Suspense>
					<TanStackRouterDevtools />
				</Suspense>
			</TRPCReactProvider>
		</ClerkProvider>
	);
}
