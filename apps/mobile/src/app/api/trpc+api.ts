import { appRouter, createTRPCContext } from "@recordscratch/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export function GET(request: Request) {
	const sessionId =
		request.headers.get("Authorization") ??
		request.headers
			.get("cookie")
			?.split(";")
			.find((cookie) => cookie.trim().startsWith("session="))
			?.split("=")[1];

	return fetchRequestHandler({
		endpoint: "/trpc",
		req: request,
		router: appRouter,
		createContext: () => createTRPCContext({ sessionId }),
	});
}

export function POST(request: Request) {
	return GET(request);
}
