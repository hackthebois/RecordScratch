import "server-only";

import { AppRouter, appRouter } from "@/server/api/_app";
import { createTRPCContext } from "@/server/api/trpc";
import { db } from "@/server/db/db";
import { TRPCClientError, createTRPCProxyClient } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const staticTrpc = appRouter.createCaller({
	db: db,
	headers: new Headers(),
	userId: null,
});

const createContext = cache(() => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
	});
});

export const serverTrpc = createTRPCProxyClient<AppRouter>({
	transformer: superjson,
	links: [
		() =>
			({ op }) =>
				observable((observer) => {
					createContext()
						.then((ctx) => {
							return callProcedure({
								procedures: appRouter._def.procedures,
								path: op.path,
								rawInput: op.input,
								ctx,
								type: op.type,
							});
						})
						.then((data) => {
							observer.next({ result: { data } });
							observer.complete();
						})
						.catch((cause: TRPCErrorResponse) => {
							observer.error(TRPCClientError.from(cause));
						});
				}),
	],
});
