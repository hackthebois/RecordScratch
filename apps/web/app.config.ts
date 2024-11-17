import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { createApp } from "vinxi";
import { config } from "vinxi/plugins/config";
import { envOnlyMacros } from "vite-env-only";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	vite: {
		plugins: [
			// this is the plugin that enables path aliases
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			config("custom", {
				define: {
					"process.env.CF_PAGES_URL": JSON.stringify(
						process.env.CF_PAGES_URL
					),
					"process.env.VITE_POSTHOG_KEY": JSON.stringify(
						process.env.VITE_POSTHOG_KEY
					),
				},
			}),
			envOnlyMacros(),
		],
	},
	server: {
		routeRules: {
			"/music/**": {
				proxy: { to: "https://api.deezer.com/**" },
				cors: true,
			},
			"/ingest/**": {
				proxy: { to: "https://app.posthog.com/**" },
				cors: true,
			},
		},
		experimental: {
			asyncContext: true,
		},
	},
});
