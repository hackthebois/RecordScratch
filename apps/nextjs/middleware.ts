import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/api/search",
		"/albums/:albumId",
		"/artists/:artistId",
	],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
