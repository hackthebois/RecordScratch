import { env } from "@/env.mjs";
import { AppRouter } from "@/server/_app";
import { auth } from "@clerk/nextjs";
import {
	createTRPCProxyClient,
	unstable_httpBatchStreamLink,
} from "@trpc/client";

export const serverTrpc = createTRPCProxyClient<AppRouter>({
	links: [
		unstable_httpBatchStreamLink({
			url: env.NEXT_PUBLIC_SITE_URL + "/api/trpc",
			headers: async () => {
				return {
					Authorization: `Bearer ${await auth().getToken()}`,
				};
			},
		}),
	],
});
