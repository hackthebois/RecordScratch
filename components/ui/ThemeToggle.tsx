"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { DropdownMenuItem } from "./DropdownMenu";

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.preventDefault();
				setTheme(theme === "light" ? "dark" : "light");
			}}
			className="flex items-center gap-1.5"
		>
			<Sun
				size={15}
				className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				size={15}
				className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			{theme === "dark" ? "Dark" : "Light"}
		</DropdownMenuItem>
	);
};
