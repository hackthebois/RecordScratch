import { TRPCReactProvider, api } from "@/trpc/react";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
	useRouterState,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import { usePostHog } from "posthog-js/react";
import React, { useEffect } from "react";

export const Route = createRootRoute({
	meta: () => [
		{
			charSet: "utf-8",
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1",
		},
		{
			title: "TanStack Start Starter",
		},
	],
	component: RootComponent,
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

function RootComponent() {
	return (
		// <PostHogProvider
		// 	apiKey={process.env.VITE_POSTHOG_KEY}
		// 	options={{
		// 		api_host: process.env.CF_PAGES_URL + "/ingest",
		// 	}}
		// >
		<TRPCReactProvider>
			<RootDocument>
				<div className="flex w-screen flex-col items-center justify-center">
					<Outlet />
				</div>
			</RootDocument>
			<ScrollRestoration getKey={(location) => location.pathname} />
			{/* <Suspense>
					<PostHogIdentify />
				</Suspense>
				<PostHogPageView /> */}
		</TRPCReactProvider>
		// {/* </PostHogProvider> */}
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<Html>
			<Head>
				<Meta />
			</Head>
			<Body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</Body>
		</Html>
	);
}
