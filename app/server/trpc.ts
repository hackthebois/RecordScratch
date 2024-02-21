import { decodeJwt } from "@clerk/clerk-sdk-node";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import Cookies from "cookies";
import SuperJSON from "superjson";
import { db } from "./db";

export const createTRPCContext = async (opts: CreateHTTPContextOptions) => {
	const cookies = new Cookies(opts.req, opts.res);
	const clientToken = cookies.get("__session");

	if (!clientToken) {
		return {
			db,
			userId: null,
		};
	}

	const client = decodeJwt(clientToken);

	return {
		db,
		userId: client.payload.sub,
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
