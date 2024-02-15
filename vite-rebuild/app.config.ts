import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { createApp } from "vinxi";
import tsconfigPaths from "vite-tsconfig-paths";

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
		{
			name: "client",
			type: "spa",
			handler: "index.html",
			target: "browser",
			plugins: () => [reactRefresh(), TanStackRouterVite(), tsconfigPaths()],
		},
	],
});
