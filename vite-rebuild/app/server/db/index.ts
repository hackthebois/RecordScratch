import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

console.log(process.env.DATABASE_URL);

// create the connection
const connection = connect({
	url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });
