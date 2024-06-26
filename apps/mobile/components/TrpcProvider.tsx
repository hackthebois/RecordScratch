import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import superjson from "superjson";

import { AppRouter } from "@recordscratch/api";
import React from "react";
import { Platform } from "react-native";
import { getBaseUrl } from "../src/utils/api";

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider(props: { children: React.ReactNode }) {
	const url = getBaseUrl();

	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
					colorMode: "ansi",
				}),
				httpBatchLink({
					transformer: superjson,
					// url: `https://recordscratch.app/trpc`,
					url: `${process.env.EXPO_PUBLIC_CF_PAGES_URL_ANDROID}/trpc`,
				}),
			],
		})
	);

	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</api.Provider>
	);
}
