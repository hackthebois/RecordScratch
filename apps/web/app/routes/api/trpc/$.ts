// routes/api/hello.ts
import { appRouter, createTRPCContext } from "@recordscratch/api";
import {
	StartAPIMethodCallback,
	createAPIFileRoute,
} from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getCookie, getEvent } from "vinxi/http";

const handler: StartAPIMethodCallback<"/api/trpc/$"> = ({ request }) => {
	const event = getEvent();
	const sessionId =
		request.headers.get("Authorization") ??
		getCookie(event, "auth_session");
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		router: appRouter,
		req: request,
		createContext: () =>
			createTRPCContext({
				sessionId,
			}),
	});
};

export const Route = createAPIFileRoute("/api/trpc/$")({
	GET: handler,
	POST: handler,
});
