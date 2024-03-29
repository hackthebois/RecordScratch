import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import "dotenv/config";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		R2_ACCESS_KEY: z.string().min(1),
		R2_ENDPOINT: z.string().min(1),
		R2_KEY_ID: z.string().min(1),
	},
	runtimeEnv: process.env,
});
