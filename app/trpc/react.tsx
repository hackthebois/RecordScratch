import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "app/server/root";
import SuperJSON from "superjson";

export const api = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();
const client = api.createClient({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchLink({
			url: "/trpc",
			transformer: SuperJSON,
		}),
	],
});
export const apiUtils = createTRPCQueryUtils({ queryClient, client });

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => client);

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}
