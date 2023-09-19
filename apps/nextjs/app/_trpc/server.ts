import { httpBatchLink } from "@trpc/client";

import { env } from "@/env.mjs";
import { appRouter } from "@/server/_app";

export const serverTrpc = appRouter.createCaller({
	links: [httpBatchLink({ url: `${env.NEXT_PUBLIC_SITE_URL}/api/trpc` })],
});
