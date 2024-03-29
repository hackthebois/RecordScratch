import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./app/server/db/schema.ts",
	driver: "pg",
	out: "./app/server/db/migrations",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
