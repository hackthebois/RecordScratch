import { profilesRouter } from "./routers/profiles";
import { ratingsRouter } from "./routers/ratings";
import { publicProcedure, router } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
const appRouter = router({
	ratings: ratingsRouter,
	profiles: profilesRouter,
	test: publicProcedure.query(async () => {
		return "Hello World";
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;

export default appRouter;
