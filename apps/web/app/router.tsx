import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import SuperJSON from "superjson";
import { ErrorComponent } from "./components/router/ErrorComponent";
import { NotFound } from "./components/ui/NotFound";
import { routeTree } from "./routeTree.gen";
import { apiUtils, queryClient } from "./trpc/react";

export function createRouter() {
	return routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: { queryClient, apiUtils },
			defaultPreload: "intent",
			defaultErrorComponent: ErrorComponent,
			defaultNotFoundComponent: () => <NotFound />,
			transformer: SuperJSON,
		}),
		queryClient
	);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
