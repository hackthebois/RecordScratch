import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@recordscratch/api";
import SuperJSON from "superjson";
import { getCookie, getEvent } from "vinxi/http";
import { serverOnly$ } from "vite-env-only/macros";

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
			fetch(url, options) {
				// Forward the session ID to when making requests to the API on the server
				const sessionId =
					serverOnly$(
						(() => {
							const event = getEvent();
							const sessionId = getCookie(event, "auth_session");
							return sessionId;
						})()
					) ?? "";
				return fetch(url, {
					...options,
					headers: {
						Authorization: sessionId,
					},
				});
			},
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
