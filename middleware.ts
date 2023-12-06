import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/albums/:albumId/:tab",
		"/artists/:artistId/:tab",
		"/api(.*)",
		"/_axiom/web-vitals",
	],
	afterAuth: ({ user }, req) => {
		if (
			!user?.publicMetadata.handle &&
			req.nextUrl.pathname !== "/onboard"
		) {
			return NextResponse.redirect(new URL("/onboard", req.url));
		}
	},
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
