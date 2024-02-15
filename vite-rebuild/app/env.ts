import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	server: {
		DATABASE_URL: z.string().min(1),
		UPSTASH_REDIS_REST_URL: z.string().min(1),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
	},
	client: {
		VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		VITE_CLERK_SIGN_IN_URL: z.string().min(1),
		VITE_CLERK_SIGN_UP_URL: z.string().min(1),
		VITE_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
		VITE_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),
		VITE_POSTHOG_KEY: z.string().min(1),
		VITE_POSTHOG_HOST: z.string().min(1),
		VITE_GITHUB_URL: z.string().url(),
		VITE_DISCORD_URL: z.string().url(),
	},
	runtimeEnv: import.meta.env ?? process.env,
});
