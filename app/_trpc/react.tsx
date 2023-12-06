"use client";

import { env } from "@/env.mjs";
import type { AppRouter } from "@/server/_app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
	children: React.ReactNode;
	headers: Headers;
}) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				unstable_httpBatchStreamLink({
					url: `${env.NEXT_PUBLIC_SITE_URL}/api/trpc`,
					headers() {
						const headers = new Map(props.headers);
						return Object.fromEntries(headers);
					},
				}),
			],
		})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>
				<trpc.Provider
					client={trpcClient}
					queryClient={queryClient as any}
				>
					{props.children}
				</trpc.Provider>
			</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
}
