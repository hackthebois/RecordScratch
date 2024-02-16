import appRouter from "#vinxi/trpc/router";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { fromNodeMiddleware } from "vinxi/http";
import { createTRPCContext } from "./app/server/trpc";

import dotenv from "dotenv";
dotenv.config();

const handler = createHTTPHandler({
	router: appRouter,
	createContext: createTRPCContext,
});

export default fromNodeMiddleware((req, res) => {
	req.url = req.url.replace(import.meta.env.BASE_URL, "");
	return handler(req, res);
});
