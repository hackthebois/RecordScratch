import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import React, { useEffect, useState } from "react";
import superjson from "superjson";

import type { AppRouter } from "@recordscratch/api";
import { Platform } from "react-native";
import { useAuth } from "./auth";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@recordscratch/api";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
	/**
	 * Gets the IP address of your host-machine. If it cannot automatically find it,
	 * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
	 * you don't have anything else running on it, or you'd have to change it.
	 *
	 * **NOTE**: This is only for development. In production, you'll want to set the
	 * baseUrl to your production API URL.
	 */
	// const debuggerHost = Constants.expoConfig?.hostUri;
	// const localhost = debuggerHost?.split(":")[0];

	const localhost =
		Platform.OS === "ios"
			? process.env.EXPO_PUBLIC_CF_PAGES_URL_IOS
			: process.env.EXPO_PUBLIC_CF_PAGES_URL_ANDROID;

	if (!localhost) {
		// return "https://turbo.t3.gg";
		throw new Error("Failed to get localhost. Please point to your production server.");
	}
	return localhost;
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */ export function TRPCProvider(props: { children: React.ReactNode }) {
	const sessionId = useAuth((s) => s.sessionId);
	const [queryClient] = useState(() => new QueryClient());
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
					url: `${getBaseUrl()}/trpc`,
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
						url: `${getBaseUrl()}/trpc`,
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
