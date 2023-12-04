import { appRouter } from "@/server/_app";
import { db } from "@/server/db/db";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => ({
			db: db,
		}),
	});

export { handler as GET, handler as POST };
