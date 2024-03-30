import { HTTPRequest, resolveHTTPResponse } from "@trpc/server/http";
import {
	eventHandler,
	getRequestURL,
	isMethod,
	readBody,
	setHeader,
	setResponseStatus,
} from "vinxi/http";
import appRouter from "./root";
import { createTRPCContext } from "./trpc";

export default eventHandler(async (event) => {
	const url = getRequestURL(event);
	const path = url.pathname.replace(/^\/trpc/, "").slice(1);

	const req: HTTPRequest = {
		query: url.searchParams,
		method: event.node.req.method || "GET",
		headers: event.node.req.headers,
		body: isMethod(event, "GET") ? null : await readBody(event),
	};

	const { status, headers, body } = await resolveHTTPResponse({
		router: appRouter,
		req,
		path,
		createContext: () => createTRPCContext(event),
	});

	setResponseStatus(event, status);

	headers &&
		Object.keys(headers).forEach((key) => {
			if (headers[key]) {
				setHeader(event, key, headers[key]!);
			}
		});

	return body;
});
