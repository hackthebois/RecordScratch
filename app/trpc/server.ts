import "server-only";

import { AppRouter, appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { auth } from "@clerk/nextjs";
import { TRPCClientError, createTRPCProxyClient } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { headers } from "next/headers";
import { cache } from "react";
import SuperJSON from "superjson";

const createContext = cache(() => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
		userId: auth().userId,
	});
});

const createPublicContext = cache(() => {
	return createTRPCContext({
		headers: new Headers({ cookie: "", "x-trpc-source": "rsc" }),
		userId: null,
	});
});

export const api = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
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

export const publicApi = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		() =>
			({ op }) =>
				observable((observer) => {
					createPublicContext()
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
