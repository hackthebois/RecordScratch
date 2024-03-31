import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/schema.ts",
	driver: "pg",
	out: "./migrations",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
