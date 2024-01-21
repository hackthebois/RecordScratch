import { db } from "@/server/db/db";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { spotify } from "./spotify";

export const createTRPCContext = async (opts: {
	headers: Headers;
	userId: string | null;
}) => {
	return {
		db,
		spotify,
		...opts,
	};
};
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
	if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

	return next({
		ctx: {
			...ctx,
			userId: ctx.userId,
		},
	});
});
