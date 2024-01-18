"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export const ThemeProvider = (props: { children: React.ReactNode }) => {
	return (
		<NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{props.children}
		</NextThemeProvider>
	);
};
