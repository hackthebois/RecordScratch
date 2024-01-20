import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

const createContext = async (req: NextRequest) => {
	// @ts-expect-error
	const { userId } = getAuth(req);
	return createTRPCContext({
		headers: req.headers,
		userId,
	});
};

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError:
			process.env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(
							`❌ tRPC failed on ${path ?? "<no-path>"}: ${
								error.message
							}`
						);
				  }
				: undefined,
	});

export { handler as GET, handler as POST };
