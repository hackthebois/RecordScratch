import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	vite: {
		plugins: () => [
			// this is the plugin that enables path aliases
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
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
	},
	// 	experimental: {
	// 		asyncContext: true,
	// 	},
	// },
	// routers: [
	// 	{
	// 		name: "public",
	// 		type: "static",
	// 		dir: "./public",
	// 		base: "/",
	// 	},
	// 	{
	// 		name: "server",
	// 		base: "/trpc",
	// 		type: "http",
	// 		handler: "./app/events/trpc.ts",
	// 		target: "server",
	// 		plugins: () => [tsconfigPaths()],
	// 	},
	// 	{
	// 		name: "client",
	// 		type: "spa",
	// 		handler: "index.html",
	// 		target: "browser",
	// 		plugins: () => [
	// 			config("custom", {
	// 				define: {
	// 					"process.env.CF_PAGES_URL": JSON.stringify(
	// 						process.env.CF_PAGES_URL
	// 					),
	// 					"process.env.VITE_POSTHOG_KEY": JSON.stringify(
	// 						process.env.VITE_POSTHOG_KEY
	// 					),
	// 				},
	// 			}),
	// 			tsconfigPaths(),
	// 			reactRefresh(),
	// 			TanStackRouterVite(),
	// 		],
	// 	},
	// 	{
	// 		name: "auth",
	// 		type: "http",
	// 		base: "/auth",
	// 		handler: "./app/events/auth.ts",
	// 		target: "server",
	// 		plugins: () => [tsconfigPaths()],
	// 	},
	// ],
});
