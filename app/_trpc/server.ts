import "server-only";

import { appRouter } from "@/server/api";
import { createTRPCContext } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { experimental_nextCacheLink } from "@trpc/next/app-dir/links/nextCache";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";
import SuperJSON from "superjson";

// https://www.answeroverflow.com/m/1196368778414530590
// https://github.com/t3-oss/create-t3-turbo/blob/main/apps/nextjs/src/trpc/server.ts

const createContext = cache(() => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc-invoke");

	return createTRPCContext({
		headers: heads,
		userId: getAuth(
			// @ts-expect-error
			new NextRequest("https://notused.com", { headers: headers() })
		).userId,
	});
});

const createPublicContext = cache(() => {
	return createTRPCContext({
		headers: new Headers({ cookie: "", "x-trpc-source": "rsc" }),
		userId: null,
	});
});

export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
	config() {
		return {
			transformer: SuperJSON,
			links: [
				// loggerLink({
				// 	enabled: (op) => true,
				// }),
				experimental_nextCacheLink({
					revalidate: false,
					router: appRouter,
					createContext,
				}),
			],
		};
	},
});

export const publicApi = experimental_createTRPCNextAppDirServer<
	typeof appRouter
>({
	config() {
		return {
			transformer: SuperJSON,
			links: [
				// loggerLink({
				// 	enabled: (op) => true,
				// }),
				experimental_nextCacheLink({
					// requests are cached for 5 seconds
					revalidate: 60 * 60,
					router: appRouter,
					createContext: createPublicContext,
				}),
			],
		};
	},
});
