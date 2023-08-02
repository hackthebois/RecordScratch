import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/", "/spotify/search", "/spotify/token"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
