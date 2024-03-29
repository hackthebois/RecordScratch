import { env } from "@/server/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { relationSchemas, tableSchemas } from "./schema";

const schema = {
	...tableSchemas,
	...relationSchemas,
};

// create the connection
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
