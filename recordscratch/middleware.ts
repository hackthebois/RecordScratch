import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/albums/:albumId/:tab",
		"/artists/:artistId/:tab",
		"/api(.*)",
		"/ingest(.*)",
		"/sign-in",
		"/sign-up",
	],
	afterAuth: async ({ userId, sessionClaims }, req) => {
		if (
			userId &&
			req.nextUrl.pathname !== "/onboard" &&
			!req.nextUrl.pathname.includes("/api")
		) {
			if (!sessionClaims.onboarded) {
				return NextResponse.redirect(new URL("/onboard", req.url));
			}
		}
	},
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
