import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: [
		"/",
		"/albums/:albumId",
		"/artists/:artistId",
		"/api/trpc/album.getAlbumAverage",
		"/api/trpc/album.getEveryAlbumAverage",
		"/api(.*)",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
