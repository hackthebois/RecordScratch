import { drizzle } from "drizzle-orm/planetscale-serverless";
import { relationSchemas, tableSchemas } from "./schema";

const schema = {
	...tableSchemas,
	...relationSchemas,
};

// create the connection
const sql = neon(process.env.NEON_DATABASE_URL!);

export const db = drizzle(sql, { schema });
