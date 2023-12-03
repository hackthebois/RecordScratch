import { db } from "@/drizzle/db/config";
import { appRouter } from "@/server/_app";

export const serverTrpc = appRouter.createCaller({
	db: db,
});
