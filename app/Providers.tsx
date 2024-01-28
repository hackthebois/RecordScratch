"use client";

import { env } from "@/env.mjs";
import { getUrl } from "@/utils/url";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const queryClient = new QueryClient();

if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: getUrl() + "/ingest",
		capture_pageview: false, // Disable automatic pageview capture, as we capture manually
	});
}

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider
			appearance={{
				variables: {
					colorPrimary: "hsl(0 0% 9%)",
					colorDanger: "hsl(0 84.2% 60.2%)",
					borderRadius: "0.5rem",
				},
			}}
		>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<PostHogProvider client={posthog}>
						{children}
					</PostHogProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</ClerkProvider>
	);
};

export default Providers;
