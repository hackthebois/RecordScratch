import { followers } from "@recordscratch/db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const FollowSchema = createSelectSchema(followers);

export type Follow = z.infer<typeof FollowSchema>;
