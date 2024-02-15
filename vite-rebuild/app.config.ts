import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { createApp } from "vinxi";
import { input } from "vinxi/plugins/config";
import tsconfigPaths from "vite-tsconfig-paths";

/** @returns {import('vinxi').RouterSchemaInput} */
function trpcRouter() {
	return {
		name: "server",
		base: "/trpc",
		type: "http",
		handler: fileURLToPath(new URL("./handler.js", import.meta.url)),
		target: "server",
		plugins: () => [
			input(
				"#vinxi/trpc/router",
				fileURLToPath(new URL("./app/server/root.ts", import.meta.url))
			),
			tsconfigPaths(),
		],
	};
}

export default createApp({
	server: {
		routeRules: {
			"/music/**": {
				proxy: "https://api.deezer.com/**",
			},
		},
	},
	routers: [
		{
			name: "public",
			type: "static",
			dir: "./public",
			base: "/",
		},
		trpcRouter(),
		{
			name: "client",
			type: "spa",
			handler: "index.html",
			target: "browser",
			plugins: () => [reactRefresh(), TanStackRouterVite(), tsconfigPaths()],
		},
	],
});
