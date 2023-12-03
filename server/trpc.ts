import { auth } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
	const { userId } = auth();

	if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

	return next({
		ctx: {
			...ctx,
			userId,
		},
	});
});
