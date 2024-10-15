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
				cors: true,
			},
			"/ingest/**": {
				proxy: "https://app.posthog.com/**",
				cors: true,
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
						"process.env.VITE_POSTHOG_KEY": JSON.stringify(
							process.env.VITE_POSTHOG_KEY
						),
					},
				}),
				tsconfigPaths(),
				reactRefresh(),
				TanStackRouterVite(),
			],
		},
		{
			name: "api",
			type: "http",
			base: "/api",
			handler: "./app/events/api.ts",
			target: "server",
			plugins: () => [tsconfigPaths()],
		},
	],
});
