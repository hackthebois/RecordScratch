// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { httpBatchLink, loggerLink } from "@trpc/client";
// import { createTRPCReact } from "@trpc/react-query";
// import { useState } from "react";
// import superjson from "superjson";

// import { AppRouter } from "@recordscratch/api";
// import React from "react";
// import { Platform } from "react-native";
// import { getBaseUrl } from "../src/utils/api";
// import * as SecureStore from "expo-secure-store";

// const getSessionId = async () => {
// 	return await SecureStore.getItemAsync("sessionId");
// };

// export const api = createTRPCReact<AppRouter>();

// export function TRPCProvider(props: { children: React.ReactNode }) {
// 	const [queryClient] = useState(() => new QueryClient());
// 	const [trpcClient] = useState(() =>
// 		api.createClient({
// 			links: [
// 				loggerLink({
// 					enabled: (opts) =>
// 						process.env.NODE_ENV === "development" ||
// 						(opts.direction === "down" && opts.result instanceof Error),
// 					colorMode: "ansi",
// 				}),
// 				httpBatchLink({
// 					transformer: superjson,
// 					url: `${getBaseUrl()}/trpc`,
// 					// headers: async () => {
// 					// 	const sessionId = await getSessionId();
// 					// 	return { Authorization: `Bearer ${sessionId}` };
// 					// },
// 				}),
// 			],
// 		})
// 	);

// 	return (
// 		<api.Provider client={trpcClient} queryClient={queryClient}>
// 			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
// 		</api.Provider>
// 	);
// }
