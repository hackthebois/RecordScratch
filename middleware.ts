import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/albums/:albumId/:tab",
		"/artists/:artistId/:tab",
		"/api(.*)",
		"/_axiom/web-vitals",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
