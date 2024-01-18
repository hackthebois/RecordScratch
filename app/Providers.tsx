"use client";

import { env } from "@/env.mjs";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
		capture_pageview: false, // Disable automatic pageview capture, as we capture manually
	});
}

export const ThemeProvider = (props: { children: React.ReactNode }) => {
	return (
		<PostHogProvider client={posthog}>
			<NextThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
			>
				{props.children}
			</NextThemeProvider>
		</PostHogProvider>
	);
};
