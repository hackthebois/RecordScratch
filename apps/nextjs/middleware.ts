import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/", "/search"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
