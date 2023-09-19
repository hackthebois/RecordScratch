import { auth } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";
const t = initTRPC.create();

// User Auth Middleware
const isAuthed = t.middleware(({ next }) => {
	const { userId } = auth();

	// user not identified
	if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

	return next({
		ctx: {
			userId: userId,
		},
	});
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(isAuthed);
