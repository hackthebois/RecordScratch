import { appRouter } from "@/server/_app";
import { db } from "@/server/db/db";

export const serverTrpc = appRouter.createCaller({
	db: db,
});
