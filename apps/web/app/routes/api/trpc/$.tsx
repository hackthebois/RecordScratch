// routes/api/hello.ts
import { appRouter, createTRPCContext } from "@recordscratch/api";
import { createAPIFileRoute } from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getCookie, getEvent } from "vinxi/http";

export const Route = createAPIFileRoute("/api/trpc/$")({
	GET: async ({ request: req }) => {
		const event = getEvent();
		const sessionId =
			req.headers.get("Authorization") ??
			getCookie(event, "auth_session");
		return fetchRequestHandler({
			endpoint: "/api/trpc",
			req,
			router: appRouter,
			createContext: () => createTRPCContext({ sessionId }),
		});
	},
	POST: async ({ request: req }) => {
		const event = getEvent();
		const sessionId =
			req.headers.get("Authorization") ??
			getCookie(event, "auth_session");
		return fetchRequestHandler({
			endpoint: "/api/trpc",
			req,
			router: appRouter,
			createContext: () => createTRPCContext({ sessionId }),
		});
	},
});
