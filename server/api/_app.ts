import { resourceRouter } from "./routers/resource";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
	resource: resourceRouter,
	user: userRouter,
});

export type AppRouter = typeof appRouter;
