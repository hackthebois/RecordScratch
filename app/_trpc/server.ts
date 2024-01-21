import "server-only";

import { appRouter } from "@/server/api/root";
import { createCallerFactory, createTRPCContext } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

const createCaller = createCallerFactory(appRouter);

// https://www.answeroverflow.com/m/1196368778414530590
// https://github.com/t3-oss/create-t3-turbo/blob/main/apps/nextjs/src/trpc/server.ts

const createContext = cache(() => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");

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

export const api = createCaller(createContext);

export const publicApi = createCaller(createPublicContext);
