import { ThemeProvider } from "@/components/theme/ThemeProvider";
import appCss from "@/index.css?url";
import { seo } from "@/lib/seo";
import { apiUtils } from "@/trpc/react";
import { QueryClient } from "@tanstack/react-query";
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
	useRouteContext,
	useRouterState,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import { usePostHog } from "posthog-js/react";
import React, { Suspense, useEffect } from "react";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	apiUtils: typeof apiUtils;
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
	links: () => [
		{ rel: "stylesheet", href: appCss },
		{
			rel: "icon",
			type: "image/svg+xml",
			href: "/logo.svg",
		},
	],
	beforeLoad: async ({ context: { apiUtils } }) => {
		const profile = await apiUtils.profiles.me.ensureData();

		return {
			profile,
		};
	},
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
	const { profile } = useRouteContext({
		from: "__root__",
	});
	const posthog = usePostHog();

	useEffect(() => {
		if (!profile) return;
		posthog.identify(profile.userId, {
			handle: profile.handle,
			name: profile.name,
		});
	}, [profile, posthog]);

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
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					{children}
					<ScrollRestoration
						getKey={(location) => location.pathname}
					/>
					<Suspense>
						<PostHogIdentify />
					</Suspense>
					<PostHogPageView />
					<Scripts />
				</ThemeProvider>
			</Body>
		</Html>
	);
}
