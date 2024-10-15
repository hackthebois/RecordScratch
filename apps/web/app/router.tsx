import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { PostHogProvider } from "posthog-js/react";
import SuperJSON from "superjson";
import { ErrorComponent } from "./components/router/ErrorComponent";
import { NotFound } from "./components/ui/NotFound";
import { routeTree } from "./routeTree.gen";
import { TRPCReactProvider, apiUtils, queryClient } from "./trpc/react";

export function createRouter() {
	return routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: { queryClient, apiUtils },
			defaultPreload: "intent",
			defaultErrorComponent: ErrorComponent,
			defaultNotFoundComponent: () => <NotFound />,
			transformer: SuperJSON,
			InnerWrap: ({ children }) => (
				<TRPCReactProvider queryClient={queryClient}>
					<PostHogProvider
						apiKey={process.env.VITE_POSTHOG_KEY}
						options={{
							api_host: process.env.CF_PAGES_URL + "/ingest",
						}}
					>
						{children}
					</PostHogProvider>
				</TRPCReactProvider>
			),
		}),
		queryClient
	);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
