import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import React, { useEffect, useState } from "react";
import superjson from "superjson";

import type { AppRouter } from "@recordscratch/api";
import env from "~/env";
import { useAuth } from "./auth";
import { catchError } from "./errors";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@recordscratch/api";

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */ export function TRPCProvider(props: { children: React.ReactNode }) {
	const sessionId = useAuth((s) => s.sessionId);

	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: catchError,
				}),
			})
	);
	const [trpcClient, setTrpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
					colorMode: "css",
				}),
				httpBatchLink({
					transformer: superjson,
					url: `${env.SITE_URL}/trpc`,
					async headers() {
						const headers = new Map<string, string>();
						headers.set("x-trpc-source", "expo-react");
						headers.set("Authorization", `${sessionId}`);
						return Object.fromEntries(headers);
					},
				}),
			],
		})
	);

	useEffect(() => {
		setTrpcClient(
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
						url: `${env.SITE_URL}/trpc`,
						async headers() {
							const headers = new Map<string, string>();
							headers.set("x-trpc-source", "expo-react");
							headers.set("Authorization", `${sessionId}`);
							return Object.fromEntries(headers);
						},
					}),
				],
			})
		);
	}, [sessionId]);

	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</api.Provider>
	);
}
