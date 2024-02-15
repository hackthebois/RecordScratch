import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "app/server/root";
import SuperJSON from "superjson";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				httpBatchLink({
					url: "/trpc",
					transformer: SuperJSON,
				}),
			],
		})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}
