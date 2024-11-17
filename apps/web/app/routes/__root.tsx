import { ThemeProvider } from "@/components/theme/ThemeProvider";
import appCss from "@/index.css?url";
import { seo } from "@/lib/seo";
import { TRPCReactProvider, apiUtils } from "@/trpc/react";
import { Profile } from "@recordscratch/types";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
	useRouterState,
} from "@tanstack/react-router";
import {
	Body,
	Head,
	Html,
	Meta,
	Scripts,
	createServerFn,
} from "@tanstack/start";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import React, { Suspense, useEffect } from "react";

const testFunc = createServerFn("GET", async () => {
	console.log("Test Func");
	return "Test";
});

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
	beforeLoad: () => {
		return {
			profile: null as Profile | null,
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
	const { queryClient } = Route.useRouteContext();

	const { data } = useSuspenseQuery({
		queryKey: ["test"],
		queryFn: () => testFunc(),
	});

	console.log(data);

	return (
		<TRPCReactProvider queryClient={queryClient}>
			<PostHogProvider
				apiKey={process.env.VITE_POSTHOG_KEY}
				options={{
					api_host: process.env.CF_PAGES_URL + "/ingest",
				}}
			>
				<RootDocument>
					<div className="flex w-screen flex-col items-center justify-center">
						<Outlet />
					</div>
				</RootDocument>
			</PostHogProvider>
		</TRPCReactProvider>
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
