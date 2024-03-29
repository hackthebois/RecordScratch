import { TRPCError, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { AwsClient } from "aws4fetch";
import Cookies from "cookies";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import { getLucia } from "./auth/lucia";
import { getDB } from "./db";

export const createTRPCContext = async (opts: CreateHTTPContextOptions) => {
	const cookies = new Cookies(opts.req, opts.res);
	const sessionId = cookies.get("auth_session");

	const r2 = new AwsClient({
		accessKeyId: process.env.R2_KEY_ID!,
		secretAccessKey: process.env.R2_ACCESS_KEY!,
		region: "auto",
	});
	const db = getDB();
	const lucia = getLucia();

	console.log("DB", db);

	if (!sessionId) {
		return {
			db,
			r2,
			userId: null,
		};
	}

	const { session } = await lucia.validateSession(sessionId);

	if (!session) {
		return {
			db,
			r2,
			userId: null,
		};
	}

	return {
		db,
		r2,
		userId: session.userId,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: SuperJSON,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
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
