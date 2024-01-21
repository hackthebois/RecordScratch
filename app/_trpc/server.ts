import "server-only";

import { AppRouter, appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCClientError, createTRPCProxyClient } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";
import SuperJSON from "superjson";

const createContext = cache(() => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
		userId: null,
	});
});

const createPublicContext = cache(() => {
	return createTRPCContext({
		headers: new Headers({ cookie: "", "x-trpc-source": "rsc" }),
		userId: getAuth(
			// @ts-expect-error
			new NextRequest("https://notused.com", { headers: headers() })
		).userId,
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
