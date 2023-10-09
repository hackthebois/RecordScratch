import { ratingRouter } from "./rating";
import { spotifyRouter } from "./spotify";
import { router } from "./trpc";

export const appRouter = router({
	rating: ratingRouter,
	spotify: spotifyRouter,
});

export type AppRouter = typeof appRouter;
