import { albumRouter } from "./albumRating";
import { songRouter } from "./songRatings";
import { spotifyRouter } from "./spotify";
import { router } from "./trpc";

export const appRouter = router({
	album: albumRouter,
	spotify: spotifyRouter,
	song: songRouter,
});
export type AppRouter = typeof appRouter;
