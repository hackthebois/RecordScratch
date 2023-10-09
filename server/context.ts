import { db } from "@/drizzle/db/config";
import { getAuth } from "@clerk/nextjs/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts?: FetchCreateContextFnOptions) {
	//@ts-ignore
	const session = getAuth(opts?.req);

	return {
		session,
		headers: opts && Object.fromEntries(opts.req.headers),
		db,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
