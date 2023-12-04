import { resourceRouter } from "./resource";
import { router } from "./trpc";
import { userRouter } from "./user";

export const appRouter = router({
	resource: resourceRouter,
	user: userRouter,
});

export type AppRouter = typeof appRouter;
