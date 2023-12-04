import { db } from "@/server/db/db";

export const createContext = () => {
	return {
		db,
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
