import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";

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
				<TanStackRouterDevtools />
			</TRPCReactProvider>
		</ClerkProvider>
	);
}
