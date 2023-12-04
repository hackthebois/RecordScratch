import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config();

export default {
	schema: "./server/db/schema.ts",
	driver: "mysql2",
	out: "./server/db/migrations",
	dbCredentials: {
		uri: process.env.DATABASE_URL!,
	},
} satisfies Config;
