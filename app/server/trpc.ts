import { TRPCError, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import Cookies from "cookies";
import SuperJSON from "superjson";
import { lucia } from "./auth/lucia";
import { db } from "./db";

export const createTRPCContext = async (opts: CreateHTTPContextOptions) => {
	const cookies = new Cookies(opts.req, opts.res);
	const sessionId = cookies.get("auth_session");

	if (!sessionId) {
		return {
			db,
			userId: null,
		};
	}

	const { session } = await lucia.validateSession(sessionId);

	if (!session) {
		return {
			db,
			userId: null,
		};
	}

	return {
		db,
		userId: session.userId,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
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
	if (!ctx.userId) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource.",
		});
	}

	return next({
		ctx: {
			...ctx,
			userId: ctx.userId,
		},
	});
});
