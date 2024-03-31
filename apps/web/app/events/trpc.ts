import { appRouter, createTRPCContext } from "@recordscratch/api";
import { HTTPRequest, resolveHTTPResponse } from "@trpc/server/http";
import {
	eventHandler,
	getCookie,
	getRequestURL,
	isMethod,
	readBody,
	setHeader,
	setResponseStatus,
} from "vinxi/http";

export default eventHandler(async (event) => {
	const url = getRequestURL(event);
	const path = url.pathname.replace(/^\/trpc/, "").slice(1);

	const req: HTTPRequest = {
		query: url.searchParams,
		method: event.node.req.method || "GET",
		headers: event.node.req.headers,
		body: isMethod(event, "GET") ? null : await readBody(event),
	};

	const sessionId = getCookie(event, "auth_session");

	const { status, headers, body } = await resolveHTTPResponse({
		router: appRouter,
		req,
		path,
		createContext: () => createTRPCContext({ sessionId }),
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
