import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({ path: "../../.env" });

export default {
	schema: "./src/schema.ts",
	dialect: "postgresql",
	out: "./src/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
