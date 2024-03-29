import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_POSTHOG_KEY: z.string().min(1),
		VITE_GITHUB_URL: z.string().url(),
		VITE_DISCORD_URL: z.string().url(),
		VITE_BASE_URL: z.string().url(),
		VITE_R2_PUBLIC_URL: z.string().url(),
	},
	runtimeEnv: import.meta.env,
});
