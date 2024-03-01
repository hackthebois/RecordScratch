import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

// create the connection
const connection = new Client({
	url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });
