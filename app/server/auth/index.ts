import { eventHandler, getCookie, getRequestURL, setCookie } from "vinxi/http";
import { callback, handler } from "./google";
import { lucia } from "./lucia";

export default eventHandler(async (event) => {
	const url = getRequestURL(event);

	if (url.pathname === "/auth/signout" || url.pathname === "/auth/signout/") {
		const session = getCookie(event, "auth_session");
		if (!session) return;
		const blankCookie = lucia.createBlankSessionCookie();
		setCookie(
			event,
			blankCookie.name,
			blankCookie.value,
			blankCookie.attributes
		);
		await lucia.invalidateSession(session);
	}
	if (url.pathname === "/auth/google" || url.pathname === "/auth/google/") {
		return handler(event);
	}
	if (
		url.pathname === "/auth/google/callback" ||
		url.pathname === "/auth/google/callback/"
	) {
		return callback(event);
	}

	return {
		url: url.pathname,
	};
});
