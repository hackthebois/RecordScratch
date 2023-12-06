import { auth } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure.use(({ ctx, next }) => {
	return next({ ctx: { ...ctx, userId: auth().userId } });
});
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
	const { userId } = ctx;
	if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

	return next({
		ctx: {
			...ctx,
			userId,
		},
	});
});
