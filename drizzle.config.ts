import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./packages/db/src/schema.ts",
	driver: "pg",
	out: "./packages/db/migrations",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
