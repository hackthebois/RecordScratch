import { db } from "@/drizzle/db/config";

export const createContext = () => {
	return {
		db,
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
