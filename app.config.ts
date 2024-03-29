import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { createApp } from "vinxi";
import { config, input } from "vinxi/plugins/config";
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
			handler: fileURLToPath(new URL("./handler.js", import.meta.url)),
			target: "server",
			plugins: () => [
				tsconfigPaths(),
				input(
					"#vinxi/trpc/router",
					fileURLToPath(
						new URL("./app/server/root.ts", import.meta.url)
					)
				),
			],
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
			handler: "./app/server/auth/index.ts",
			target: "server",
			plugins: () => [tsconfigPaths()],
		},
	],
});
