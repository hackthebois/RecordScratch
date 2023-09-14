import type { Config } from "drizzle-kit";
import {env} from "env.mjs"

console.log(env.DATABASE_URL)

export default {
  schema: "./db/schema.ts",
  driver: 'mysql2',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  }
} satisfies Config;