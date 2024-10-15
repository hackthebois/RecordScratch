import { ThemeProvider } from "@/components/theme/ThemeProvider";
import appCss from "@/index.css?url";
import { seo } from "@/lib/seo";
import { getUser } from "@recordscratch/api";
import { Profile } from "@recordscratch/types";
import { QueryClient } from "@tanstack/react-query";
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
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
import { usePostHog } from "posthog-js/react";
import React, { Suspense, useEffect } from "react";
import { getCookie, getEvent } from "vinxi/http";

export const getProfile = createServerFn("GET", async () => {
	const event = getEvent();
	const sessionId = getCookie(event, "auth_session");
	if (!sessionId) return null;
	return await getUser(sessionId);
});

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
	beforeLoad: async () => {
		const profile = (await getProfile()) as Profile | null;

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
	const { profile } = Route.useRouteContext();
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
