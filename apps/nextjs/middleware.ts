import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/albums/:albumId",
		"/artists/:artistId",
		"/api/trpc/rating.getAlbumAverage",
		"/api/trpc/rating.getEveryAlbumAverage",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
