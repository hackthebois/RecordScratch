import appRouter from "#vinxi/trpc/router";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { fromNodeMiddleware } from "vinxi/http";
import { createTRPCContext } from "./app/server/trpc";

export default fromNodeMiddleware((req, res) => {
	// eslint-disable-next-line no-undef
	req.url = req.url.replace(process.env.CF_PAGES_URL, "");

	const handler = createHTTPHandler({
		router: appRouter,
		createContext: createTRPCContext,
	});

	return handler(req, res);
});
