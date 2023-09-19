import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/api/search",
		"/albums/:albumId",
		"/artists/:artistId",
	],
	ignoredRoutes: ["/((?!api|trpc))(_next|.+..+)(.*)", "/api/trpc/rateAlbum"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
