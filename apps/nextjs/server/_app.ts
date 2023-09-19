import { ratingRouter } from "./rating";
import { mergeRouters } from "./trpc";

export const appRouter = mergeRouters(ratingRouter);
export type AppRouter = typeof appRouter;
