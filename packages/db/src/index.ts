import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { relationSchemas, tableSchemas } from "./schema";

export * from "./schema";

const schema = {
  ...tableSchemas,
  ...relationSchemas,
};

// create the connection

export const getDB = (url: string) => {
  const sql = neon(url);
  return drizzle(sql, { schema });
};
