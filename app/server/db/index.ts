import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { tableSchemas, relationSchemas } from "./schema";

const schema = {
	...tableSchemas,
	...relationSchemas,
};

// create the connection
const connection = new Client({
	url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });
