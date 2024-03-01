import { listsRouter } from "./routers/lists";
import { profilesRouter } from "./routers/profiles";
import { ratingsRouter } from "./routers/ratings";
import { usersRouter } from "./routers/users";
import { router } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
const appRouter = router({
	ratings: ratingsRouter,
	profiles: profilesRouter,
	users: usersRouter,
	lists: listsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export default appRouter;
