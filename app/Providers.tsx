"use client";

import { env } from "@/env.mjs";
import { getUrl } from "@/utils/url";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { TRPCReactProvider } from "./_trpc/react";

if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: getUrl() + "/ingest",
		capture_pageview: false, // Disable automatic pageview capture, as we capture manually
	});
}

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<TRPCReactProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<PostHogProvider client={posthog}>{children}</PostHogProvider>
			</ThemeProvider>
		</TRPCReactProvider>
	);
};

export default Providers;
