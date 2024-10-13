import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@recordscratch/api";
import SuperJSON from "superjson";

export const api = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const client = api.createClient({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchLink({
			url: process.env.CF_PAGES_URL + "/api/trpc",
			transformer: SuperJSON,
		}),
	],
});

export const apiUtils = createTRPCQueryUtils({ queryClient, client });

export function TRPCReactProvider(props: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<api.Provider client={client} queryClient={props.queryClient}>
			{props.children}
		</api.Provider>
	);
}
