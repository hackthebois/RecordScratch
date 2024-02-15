import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";

// export const createTRPCContext = async (opts: { userId: string | null }) => {
// 	const userId = opts.userId ?? null;

// 	return {
// 		db,
// 		userId,
// 	};
// };

const t = initTRPC.create({
	transformer: SuperJSON,
	// errorFormatter({ shape, error }) {
	// 	return {
	// 		...shape,
	// 		data: {
	// 			...shape.data,
	// 			zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
	// 		},
	// 	};
	// },
});

export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const router = t.router;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	// const { userId } = auth();
	const userId = null;

	if (!userId) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource.",
		});
	}

	return next({
		ctx: {
			...ctx,
			userId,
		},
	});
});
