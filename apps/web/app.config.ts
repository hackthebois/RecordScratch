import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { createApp } from "vinxi";
import { config } from "vinxi/plugins/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default createApp({
	server: {
		routeRules: {
			"/music/**": {
				proxy: "https://api.deezer.com/**",
			},
			"/ingest/**": {
				proxy: "https://app.posthog.com/**",
			},
		},
		experimental: {
			asyncContext: true,
		},
	},
	routers: [
		{
			name: "public",
			type: "static",
			dir: "./public",
			base: "/",
		},
		{
			name: "server",
			base: "/trpc",
			type: "http",
			handler: "./app/events/trpc.ts",
			target: "server",
			plugins: () => [tsconfigPaths()],
		},
		{
			name: "client",
			type: "spa",
			handler: "index.html",
			target: "browser",
			plugins: () => [
				config("custom", {
					define: {
						"process.env.CF_PAGES_URL": JSON.stringify(
							process.env.CF_PAGES_URL
						),
					},
				}),
				tsconfigPaths(),
				reactRefresh(),
				TanStackRouterVite(),
			],
		},
		{
			name: "auth",
			type: "http",
			base: "/auth",
			handler: "./app/events/auth.ts",
			target: "server",
			plugins: () => [tsconfigPaths()],
		},
	],
});
