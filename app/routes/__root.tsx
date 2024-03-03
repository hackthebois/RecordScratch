import { ThemeProvider } from "@/components/ThemeProvider";
import { env } from "@/env";
import { TRPCReactProvider, api } from "@/trpc/react";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
	useRouterState,
} from "@tanstack/react-router";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import React, { Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";

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

const PostHogPageView = () => {
	const location = useRouterState({ select: (s) => s.location });
	const posthog = usePostHog();

	useEffect(() => {
		posthog.capture("$pageview");
	}, [location.href, posthog]);

	return null;
};

const PostHogIdentify = () => {
	const [user] = api.users.me.useSuspenseQuery();
	const posthog = usePostHog();

	useEffect(() => {
		if (!user) return;
		posthog.identify(user.id, {
			email: user.email,
		});
	}, [user, posthog]);

	return null;
};

function Root() {
	return (
		<PostHogProvider
			apiKey={env.VITE_POSTHOG_KEY}
			options={{
				api_host: env.VITE_BASE_URL + "/ingest",
			}}
		>
			<TRPCReactProvider>
				<HelmetProvider>
					<ThemeProvider defaultTheme="dark" storageKey="theme">
						<ScrollRestoration />
						<Outlet />
						<Suspense>
							<PostHogPageView />
							<PostHogIdentify />
							<TanStackRouterDevtools />
						</Suspense>
					</ThemeProvider>
				</HelmetProvider>
			</TRPCReactProvider>
		</PostHogProvider>
	);
}
