import { auth } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";

type Context = {
	userId?: string;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

// User Auth Middleware
const isAuthed = middleware(({ ctx: { userId: initialUserId }, next }) => {
	if (initialUserId) return next({ ctx: { userId: initialUserId } });

	const { userId } = auth();

	// user not identified
	if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

	return next({ ctx: { userId } });
});

export const protectedProcedure = publicProcedure.use(isAuthed);
