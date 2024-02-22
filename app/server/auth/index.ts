import { eventHandler, getRequestURL } from "vinxi/http";
import { callback, handler } from "./google";

export default eventHandler(async (event) => {
	const url = getRequestURL(event);

	if (url.pathname === "/auth/google" || url.pathname === "/auth/google/") {
		return handler(event);
	}
	if (url.pathname === "/auth/google/callback" || url.pathname === "/auth/google/callback/") {
		return callback(event);
	}

	return {
		url: url.pathname,
	};
});
