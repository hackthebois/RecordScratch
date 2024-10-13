import appCss from "@/index.css?url";
import { seo } from "@/lib/seo";
import { api } from "@/trpc/react";
import { QueryClient } from "@tanstack/react-query";
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import { usePostHog } from "posthog-js/react";
import React, { Suspense, useEffect } from "react";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	meta: () => [
		{
			charSet: "utf-8",
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1",
		},
		...seo({
			title: "RecordScratch",
		}),
	],
	links: () => [{ rel: "stylesheet", href: appCss }],
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
		<RootDocument>
			<div className="flex w-screen flex-col items-center justify-center">
				<Outlet />
			</div>
		</RootDocument>
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
				<ScrollRestoration getKey={(location) => location.pathname} />
				<Suspense>
					<PostHogIdentify />
				</Suspense>
				<PostHogPageView />
				<Scripts />
			</Body>
		</Html>
	);
}
