import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { relationSchemas, tableSchemas } from "./schema";

export * from "./schema";

const schema = {
	...tableSchemas,
	...relationSchemas,
};

// create the connection

export const getDB = () => {
	const sql = neon(process.env.DATABASE_URL!);
	return drizzle(sql, { schema });
};
