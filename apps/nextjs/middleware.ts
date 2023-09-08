import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/spotify/search",
		"/spotify/token",
		"/albums/:albumId",
		"/artists/:artistId",
	],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
