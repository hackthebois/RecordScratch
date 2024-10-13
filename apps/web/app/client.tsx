// app/client.tsx
/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "./components/ThemeProvider";
import "./index.css";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(
	document.getElementById("root")!,
	<ThemeProvider defaultTheme="dark" storageKey="theme">
		<StartClient router={router} />
	</ThemeProvider>
);
