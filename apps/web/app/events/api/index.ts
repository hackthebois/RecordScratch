import {
	EventHandlerRequest,
	H3Event,
	eventHandler,
	getRequestURL,
} from "vinxi/http";
import { authRoutes } from "./auth";
import { appleRoutes } from "./auth/apple";
import { googleRoutes } from "./auth/google";

// eslint-disable-next-line no-unused-vars
export type Route = [string, (event: H3Event<EventHandlerRequest>) => unknown];

export type RouteMap = Map<Route[0], Route[1]>;

const routes: RouteMap = new Map([
	...authRoutes,
	...googleRoutes,
	...appleRoutes,
]);

export default eventHandler(async (event) => {
	const url = getRequestURL(event);

	const route = routes.get(
		url.pathname.replace(/^\/api/, "").replace(/\/$/, "")
	);
	if (route) return route(event);

	return new Response("Not Found", { status: 404 });
});
