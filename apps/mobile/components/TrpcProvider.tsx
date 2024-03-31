import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import Constants from "expo-constants";
import { useState } from "react";

import type { AppRouter } from "@recordscratch/api/src/index";
import React from "react";

export const api = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
	const debuggerHost = Constants.expoConfig?.hostUri;
	const localhost = debuggerHost?.split(":")[0];

	if (!localhost) {
		// return "https://turbo.t3.gg";
		throw new Error("Failed to get localhost. Please point to your production server.");
	}
	return `http://${localhost}:3000`;
};

export function TRPCProvider(props: { children: React.ReactNode }) {
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
					// transformer: superjson,
					url: `${getBaseUrl()}/trpc`,
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
