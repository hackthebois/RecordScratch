import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config();

export default {
	schema: "./app/server/db/schema.ts",
	driver: "pg",
	out: "./app/server/db/migrations",
	dbCredentials: {
		connectionString: process.env.NEON_DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
